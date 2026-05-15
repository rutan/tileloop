export function parseIntegerInput(value: string) {
  const num = parseInt(value, 10);

  return isNaN(num) ? 0 : num;
}

export function parseDecimalInput(value: string) {
  const num = parseFloat(value);

  return isNaN(num) ? 0 : num;
}
