import { sampleImage } from '../assets/sample';
import { RenderParameter } from '../types/RenderParameter';

export interface RootState {
  renderParameter: RenderParameter;
  resultFile: string;
}

export const initialState: RootState = {
  renderParameter: {
    pictures: [
      {
        id: 'sample',
        url: sampleImage,
      },
    ],
    width: 1200,
    height: 630,
    itemWidth: 300,
    itemHeight: 180,
    rotation: -6,
    margin: 18,
    borderRadius: 12,
    bgColor: '#f4f6f8',
    bgOpacity: 1,
    frontColor: '#000000',
    frontOpacity: 0,
    layoutMode: 'staggered',
    arrangementSeed: 'tileloop',
  },
  resultFile: '',
};
