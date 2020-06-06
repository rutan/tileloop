import { RenderParameter } from '../types/RenderParameter';
import { sampleImage } from '../assets/sample';

export interface RootState {
  renderParameter: RenderParameter;
  resultFile: string;
}

export const initialState: RootState = {
  renderParameter: {
    pictures: [
      {
        id: 1,
        url: sampleImage,
      },
    ],
    width: 1200,
    height: 630,
    itemSizeX: 5,
    itemSizeY: 5,
    itemWidth: 320,
    itemHeight: 180,
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
