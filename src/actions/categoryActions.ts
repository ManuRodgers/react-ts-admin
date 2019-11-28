import { actionCreatorFactory } from 'dva-model-creator';
import { ICategory } from '@/interfaces';
import { AddCategoryDto } from '@/dto/add-category.dto';
import { DeleteCategoryDto } from '@/dto/delete-category.dto';
import { UpdateCategoryDto } from '@/dto/update-category.dto';

const categoryActionCreator = actionCreatorFactory('category');

// sync action creators
export const setCategories = categoryActionCreator<{ categories: ICategory[] }>('setCategories');
export const setSubCategories = categoryActionCreator<{ subCategories: ICategory[] }>(
  'setSubCategories',
);
export const setCurrentCategory = categoryActionCreator<{ currentCategory: ICategory }>(
  'setCurrentCategory',
);
export const setParentId = categoryActionCreator<{ parentId: string }>('setParentId');

//  add category
export const addCategoryAsync = categoryActionCreator<{ addCategoryDto: AddCategoryDto }>(
  'addCategoryAsync',
);
export const addCategorySync = categoryActionCreator<{ newCategory: ICategory }>('addCategorySync');

//  update category
export const updateCategoryAsync = categoryActionCreator<{ updateCategoryDto: UpdateCategoryDto }>(
  'updateCategoryAsync',
);
export const updateCategorySync = categoryActionCreator<{
  updateCategoryDto: UpdateCategoryDto;
  parentId: string;
}>('updateCategorySync');

// delete category
export const deleteCategoryAsync = categoryActionCreator<{ deleteCategoryDto: DeleteCategoryDto }>(
  'deleteCategoryAsync',
);
export const deleteCategorySync = categoryActionCreator<{ deletedCategory: ICategory }>(
  'deleteCategorySync',
);
