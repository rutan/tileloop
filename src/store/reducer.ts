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

function revokeResultFileUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

function resetResultFile(state: RootState): RootState {
  if (!state.resultFile) return state;

  revokeResultFileUrl(state.resultFile);
  return { ...state, resultFile: '' };
}

export const reducer = (state: RootState, action: Actions): RootState => {
  switch (action.type) {
    case ADD_PICTURE: {
      return resetResultFile({
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: [...state.renderParameter.pictures, action.picture],
        },
      });
    }
    case ADD_PICTURES: {
      if (action.pictures.length === 0) return state;

      return resetResultFile({
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: [...state.renderParameter.pictures, ...action.pictures],
        },
      });
    }
    case REMOVE_PICTURE: {
      const pictures = state.renderParameter.pictures.filter((image) => image.id !== action.picture.id);
      if (pictures.length === state.renderParameter.pictures.length) return state;

      revokePictureUrl(action.picture.url);

      return resetResultFile({
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures,
        },
      });
    }
    case REMOVE_ALL_PICTURES: {
      if (state.renderParameter.pictures.length === 0) return state;

      state.renderParameter.pictures.forEach((picture) => {
        revokePictureUrl(picture.url);
      });

      return resetResultFile({
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: [],
        },
      });
    }
    case SET_RESULT_FILE_URL:
      if (state.resultFile !== action.resultFile && state.resultFile) {
        revokeResultFileUrl(state.resultFile);
      }
      return { ...state, resultFile: action.resultFile };
    case UPDATE_RENDER_PARAMETER_ITEM: {
      if (Object.is(state.renderParameter[action.key], action.value)) return state;

      return resetResultFile({
        ...state,
        renderParameter: {
          ...state.renderParameter,
          [action.key]: action.value,
        },
      });
    }
  }
  return state;
};
