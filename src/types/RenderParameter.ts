import { Picture } from './Picture';

export interface RenderParameter {
  pictures: Picture[];
  width: number;
  height: number;
  itemSizeX: number;
  itemSizeY: number;
  itemWidth: number;
  itemHeight: number;
  rotation: number;
  margin: number;
  borderRadius: number;
  bgColor: string;
  bgOpacity: number;
  frontColor: string;
  frontOpacity: number;
}
