import { RenderParameter } from '../types/RenderParameter';

export interface RootState {
  renderParameter: RenderParameter;
  resultFile: string;
}

export const initialState: RootState = {
  renderParameter: {
    pictures: [],
    width: 640,
    height: 360,
    itemSizeX: 5,
    itemSizeY: 5,
    itemWidth: 150,
    itemHeight: 100,
    rotation: -8,
    margin: 10,
    borderRadius: 5,
    bgColor: '#ffffff',
    bgOpacity: 1,
    frontColor: '#000000',
    frontOpacity: 0,
  },
  resultFile: '',
};
