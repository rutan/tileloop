const svgNamespace = 'http://www.w3.org/2000/svg';
const xlinkNamespace = 'http://www.w3.org/1999/xlink';

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image data.'));
      }
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('Failed to read image data.'));
    };
    reader.readAsDataURL(blob);
  });
}

function getImageHref(image: SVGImageElement): string | null {
  return image.getAttribute('href') ?? image.getAttributeNS(xlinkNamespace, 'href') ?? image.getAttribute('xlink:href');
}

function setImageHref(image: SVGImageElement, href: string) {
  image.setAttribute('href', href);
  image.setAttributeNS(xlinkNamespace, 'href', href);
}

function createImageSignature(image: SVGImageElement, href: string): string {
  const attributes = Array.from(image.attributes)
    .filter((attribute) => attribute.name !== 'id' && attribute.name !== 'href' && attribute.name !== 'xlink:href')
    .map((attribute) => `${attribute.name}=${attribute.value}`)
    .sort();

  return [href, ...attributes].join('\n');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load exported SVG.'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG.'));
        }
      },
      'image/png',
      1,
    );
  });
}

async function createExportSvg(svg: SVGSVGElement): Promise<SVGSVGElement> {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  const defs = clonedSvg.querySelector('defs') ?? document.createElementNS(svgNamespace, 'defs');
  if (!defs.parentNode) {
    clonedSvg.insertBefore(defs, clonedSvg.firstChild);
  }

  const images = Array.from(clonedSvg.querySelectorAll('image'));
  const dataUrlCache = new Map<string, Promise<string>>();
  const definitionCache = new Map<string, string>();
  const definitionTasks: Promise<void>[] = [];

  for (const image of images) {
    const href = getImageHref(image);
    if (!href) continue;

    const imageUrl =
      href.startsWith('data:') || href.startsWith('blob:') ? href : new URL(href, window.location.href).href;
    const signature = createImageSignature(image, imageUrl);
    const cachedDefinitionId = definitionCache.get(signature);
    const definitionId = cachedDefinitionId ?? `tileloop-export-image-${definitionCache.size}`;

    if (!cachedDefinitionId) {
      definitionCache.set(signature, definitionId);
      const definitionImage = image.cloneNode(false) as SVGImageElement;
      definitionImage.removeAttribute('id');
      definitionImage.setAttribute('id', definitionId);
      defs.appendChild(definitionImage);

      const dataUrlPromise = imageUrl.startsWith('data:')
        ? Promise.resolve(imageUrl)
        : (dataUrlCache.get(imageUrl) ??
          (async () => {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);
            return readBlobAsDataUrl(await response.blob());
          })());

      dataUrlCache.set(imageUrl, dataUrlPromise);
      definitionTasks.push(
        dataUrlPromise.then((dataUrl) => {
          setImageHref(definitionImage, dataUrl);
        }),
      );
    }

    const imageUse = document.createElementNS(svgNamespace, 'use');
    imageUse.setAttribute('href', `#${definitionId}`);
    image.replaceWith(imageUse);
  }

  await Promise.all(definitionTasks);

  return clonedSvg;
}

export async function exportSvgToPngBlob(svg: SVGSVGElement, canvas: HTMLCanvasElement, width: number, height: number) {
  const exportSvg = await createExportSvg(svg);
  const svgBlob = new Blob([new XMLSerializer().serializeToString(exportSvg)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Broken canvas context.');

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await canvasToBlob(canvas);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
