import { Picture } from '../types/Picture';
import { RenderParameter } from '../types/RenderParameter';

export const ADD_PICTURE = 'ADD_PICTURE' as const;
export const addPicture = (picture: Picture) =>
  ({
    type: ADD_PICTURE,
    picture,
  }) as const;

export const ADD_PICTURES = 'ADD_PICTURES' as const;
export const addPictures = (pictures: Picture[]) =>
  ({
    type: ADD_PICTURES,
    pictures,
  }) as const;

export const REMOVE_PICTURE = 'REMOVE_PICTURE' as const;
export const removePicture = (picture: Picture) =>
  ({
    type: REMOVE_PICTURE,
    picture,
  }) as const;

export const REMOVE_ALL_PICTURES = 'REMOVE_ALL_PICTURES' as const;
export const removeAllPictures = () =>
  ({
    type: REMOVE_ALL_PICTURES,
  }) as const;

export const SET_RESULT_FILE_URL = 'SET_RESULT_FILE_URL' as const;
export const setResultFile = (resultFile: string) =>
  ({
    type: SET_RESULT_FILE_URL,
    resultFile,
  }) as const;

export const UPDATE_RENDER_PARAMETER_ITEM = 'UPDATE_RENDER_PARAMETER_ITEM' as const;

export function updateRenderParameterItem<T extends keyof RenderParameter>(key: T, value: RenderParameter[T]) {
  return {
    type: UPDATE_RENDER_PARAMETER_ITEM,
    key,
    value,
  } as const;
}

export type Actions =
  | ReturnType<typeof addPicture>
  | ReturnType<typeof addPictures>
  | ReturnType<typeof removePicture>
  | ReturnType<typeof removeAllPictures>
  | ReturnType<typeof setResultFile>
  | ReturnType<typeof updateRenderParameterItem>;
