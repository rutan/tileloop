import { Actions, ADD_PICTURE, REMOVE_PICTURE, SET_RESULT_FILE_URL, UPDATE_RENDER_PARAMETER_ITEM } from './actions';
import { RootState } from './state';

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
    case REMOVE_PICTURE: {
      return {
        ...state,
        renderParameter: {
          ...state.renderParameter,
          pictures: state.renderParameter.pictures.filter((image) => image.id !== action.picture.id),
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
