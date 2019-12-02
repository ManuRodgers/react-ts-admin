import { DvaModelBuilder } from 'dva-model-creator';
import { IGlobalState } from '@/interfaces';
import { ProductStatus } from '@/enums';

const initState: IGlobalState['product'] = {
  products: [
    {
      status: ProductStatus.FOR_SALE,
      imgs: [],
      _id: '1',
      name: 'Manu',
      desc: 'Manu Rodgers is the greatest of all time',
      price: 2000,
      pCategoryId: '5ddca2797fa0442cb4f99922',
      categoryId: '"5de03df7a76c8dfde755433e"',
      detail: 'goat',
      __v: 0,
    },
    {
      status: ProductStatus.FOR_SALE,
      imgs: [],
      _id: '2',
      name: 'Timmy',
      desc: 'Timmy Duncan is the greatest of all time',
      price: 2100,
      pCategoryId: '5ddca2797fa0442cb4f99922',
      categoryId: '5de043cda76c8dfde7554340',
      detail: 'goat',
      __v: 0,
    },
  ],
  currentProduct: {},
};
const productBuilder = new DvaModelBuilder(initState, 'product');

export default productBuilder.build();
