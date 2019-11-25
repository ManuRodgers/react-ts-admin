import { DvaModelBuilder } from 'dva-model-creator';

import { setCategories, setCurrentCategory, setSubCategories } from '@/actions/categoryActions';
import { IGlobalState } from '@/interfaces';

const initState: IGlobalState['category'] = {
  categories: [],
  subCategories: [],
  currentCategory: {
    parentId: '0',
    _id: '0',
    name: '',
  },
};
const categoryBuilder = new DvaModelBuilder(initState, 'category')
  .case(setCategories, (state, { categories }) => ({ ...state, categories }))
  .case(setSubCategories, (state, { subCategories }) => ({ ...state, subCategories }))
  .case(setCurrentCategory, (state, { currentCategory }) => ({ ...state, currentCategory }));

export default categoryBuilder.build();
