import {
  Actions,
  ADD_PICTURE,
  ADD_PICTURES,
  REMOVE_ALL_PICTURES,
  REMOVE_PICTURE,
  SET_RESULT_FILE_URL,
  UPDATE_RENDER_PARAMETER_ITEM,
} from './actions';
import { RootState } from './state';

function revokePictureUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export const reducer = (state: RootState, action: Actions): RootState => {
  switch (action.type) {
    case ADD_PICTURE: {
      return {
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: [...state.renderParameter.pictures, action.picture],
        },
      };
    }
    case ADD_PICTURES: {
      return {
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: [...state.renderParameter.pictures, ...action.pictures],
        },
      };
    }
    case REMOVE_PICTURE: {
      revokePictureUrl(action.picture.url);

      return {
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: state.renderParameter.pictures.filter((image) => image.id !== action.picture.id),
        },
      };
    }
    case REMOVE_ALL_PICTURES: {
      state.renderParameter.pictures.forEach((picture) => {
        revokePictureUrl(picture.url);
      });

      return {
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: [],
        },
      };
    }
    case SET_RESULT_FILE_URL:
      if (state.resultFile !== action.resultFile && state.resultFile) {
        URL.revokeObjectURL(state.resultFile);
      }
      return { ...state, resultFile: action.resultFile };
    case UPDATE_RENDER_PARAMETER_ITEM: {
      return {
        ...state,
        renderParameter: {
          ...state.renderParameter,
          [action.key]: action.value,
        },
      };
    }
  }
  return state;
};
