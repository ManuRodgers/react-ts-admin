import { actionCreatorFactory } from 'dva-model-creator';
import { ICategory } from '@/interfaces';

const categoryActionCreator = actionCreatorFactory('category');

// sync action creators
export const setCategories = categoryActionCreator<{ categories: ICategory[] }>('setCategories');
export const setSubCategories = categoryActionCreator<{ subCategories: ICategory[] }>(
  'setSubCategories',
);
export const setCurrentCategory = categoryActionCreator<{ currentCategory: ICategory }>(
  'setCurrentCategory',
);
