import { DvaModelBuilder } from 'dva-model-creator';
import { message } from 'antd';

import {
  setCategories,
  setCurrentCategory,
  setSubCategories,
  setParentId,
  addCategorySync,
  addCategoryAsync,
  updateCategoryAsync,
  updateCategorySync,
  deleteCategorySync,
  deleteCategoryAsync,
} from '@/actions/categoryActions';
import { IGlobalState } from '@/interfaces';
import { addCategory, deleteCategory, updateCategory } from '@/api';

const initState: IGlobalState['category'] = {
  categories: [],
  subCategories: [],
  currentCategory: {
    parentId: '0',
    _id: '0',
    name: '',
  },
  parentId: '0',
};
const categoryBuilder = new DvaModelBuilder(initState, 'category')
  .case(setCategories, (state, { categories }) => ({ ...state, categories }))
  .case(setParentId, (state, { parentId }) => ({ ...state, parentId }))
  .case(setSubCategories, (state, { subCategories }) => ({ ...state, subCategories }))
  .case(setCurrentCategory, (state, { currentCategory }) => ({ ...state, currentCategory }))
  .case(addCategorySync, (state, { newCategory }) => {
    console.log(`newCategory`, newCategory);
    if (newCategory.parentId === '0') {
      return { ...state, categories: [...state.categories, newCategory] };
    } else if (newCategory.parentId !== '0') {
      console.log(`newCategory.parentId`, newCategory.parentId);
      return { ...state, subCategories: [...state.subCategories, newCategory] };
    } else {
      return state;
    }
  })
  .case(updateCategorySync, (state, { updateCategoryDto, parentId }) => {
    console.log(`updateCategoryDto`, updateCategoryDto);
    console.log(`parentId`, parentId);
    const { categoryId, categoryName } = updateCategoryDto;
    if (parentId === '0') {
      console.log(`update 0`);
      return {
        ...state,
        categories: state.categories.map(category => {
          if (category._id === categoryId) {
            return { ...category, name: categoryName };
          }
          return category;
        }),
      };
    } else if (parentId !== '0') {
      console.log(`update !!0`);
      return {
        ...state,
        subCategories: state.subCategories.map(category => {
          if (category._id === categoryId) {
            return { ...category, name: categoryName };
          }
          return category;
        }),
      };
    } else {
      return state;
    }
  })
  .case(deleteCategorySync, (state, { deletedCategory }) => {
    console.log(`deletedCategory`, deletedCategory);
    if (deletedCategory.parentId === '0') {
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== deletedCategory._id),
      };
    } else if (deletedCategory.parentId !== '0') {
      return {
        ...state,
        subCategories: state.subCategories.filter(category => category._id !== deletedCategory._id),
      };
    } else {
      return state;
    }
  })
  .takeEvery(addCategoryAsync, function*({ addCategoryDto }, { select, put }) {
    console.log(`addCategoryDto`, addCategoryDto);
    const res = yield addCategory(addCategoryDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      yield delete res.data.__v;
      return yield put(addCategorySync({ newCategory: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  })
  .takeEvery(updateCategoryAsync, function*({ updateCategoryDto }, { select, put }) {
    const res = yield updateCategory(updateCategoryDto);
    if (res.status === 1) {
      return yield message.error(res.msg);
    }
  })
  .takeEvery(deleteCategoryAsync, function*({ deleteCategoryDto }, { select, put }) {
    const res = yield deleteCategory(deleteCategoryDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      yield delete res.data.__v;
      return yield put(deleteCategorySync({ deletedCategory: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  });

export default categoryBuilder.build();
