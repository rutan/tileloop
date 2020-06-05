import { RootState } from './state';
import { Actions, ADD_PICTURE, REMOVE_PICTURE, SET_RESULT_FILE_URL, UPDATE_RENDER_PARAMETER_ITEM } from './actions';
import { RenderParameter } from '../types/RenderParameter';

export const reducer = (state: RootState, action: Actions): RootState => {
  switch (action.type) {
    case ADD_PICTURE: {
      const newParameter: RenderParameter = { ...state.renderParameter };
      newParameter.pictures.push(action.picture);
      return { ...state, renderParameter: newParameter };
    }
    case REMOVE_PICTURE: {
      const newParameter: RenderParameter = { ...state.renderParameter };
      newParameter.pictures = newParameter.pictures.filter((image) => image.id !== action.picture.id);
      return { ...state, renderParameter: newParameter };
    }
    case SET_RESULT_FILE_URL:
      if (state.resultFile !== action.resultFile && state.resultFile) {
        URL.revokeObjectURL(state.resultFile);
      }
      return { ...state, resultFile: action.resultFile };
    case UPDATE_RENDER_PARAMETER_ITEM: {
      const newParameter: RenderParameter = { ...state.renderParameter };
      (newParameter as any)[action.key] = action.value;
      return { ...state, renderParameter: newParameter };
    }
  }
  return state;
};
