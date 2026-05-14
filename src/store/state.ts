import sampleImage01 from '../assets/01.jpg';
import sampleImage02 from '../assets/02.jpg';
import sampleImage03 from '../assets/03.jpg';
import sampleImage04 from '../assets/04.jpg';
import { RenderParameter } from '../types/RenderParameter';

export interface RootState {
  renderParameter: RenderParameter;
  resultFile: string;
}

export const initialState: RootState = {
  renderParameter: {
    pictures: [
      {
        id: 'sample1',
        url: sampleImage01,
      },
      {
        id: 'sample2',
        url: sampleImage02,
      },
      {
        id: 'sample3',
        url: sampleImage03,
      },
      {
        id: 'sample4',
        url: sampleImage04,
      },
    ],
    width: 1200,
    height: 630,
    itemWidth: 240,
    itemHeight: 240,
    rotation: -6,
    margin: 18,
    borderRadius: 12,
    bgColor: '#f4f6f8',
    bgOpacity: 1,
    frontColor: '#000000',
    frontOpacity: 0,
    shadowColor: '#333333',
    shadowOpacity: 0.1,
    shadowBlur: 3,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    layoutMode: 'staggered',
    arrangementSeed: 'tileloop',
  },
  resultFile: '',
};
