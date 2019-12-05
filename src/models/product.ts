import { DvaModelBuilder } from 'dva-model-creator';
import {
  setProducts,
  setCurrentProduct,
  addProductAsync,
  addProductSync,
  updateProductAsync,
  updateProductSync,
  deleteProductAsync,
  deleteProductSync,
} from '@/actions/productActions';
import { IGlobalState } from '@/interfaces';
import { ProductStatus } from '@/enums';
import { addProduct, updateProduct } from '@/api';
import { message } from 'antd';
import { router } from 'umi';

const initState: IGlobalState['product'] = {
  products: [],
  currentProduct: {
    imgs: [],
    detail: '',
  },
};
const productBuilder = new DvaModelBuilder(initState, 'product')
  .case(setProducts, (state, { products }) => ({ ...state, products }))
  .case(addProductSync, (state, { newProduct }) => ({
    ...state,
    products: [...state.products, newProduct],
  }))
  .case(updateProductSync, (state, { updateProductDto }) => ({
    ...state,
    products: state.products.map(product => {
      if (product._id === updateProductDto._id) {
        return { ...product, ...updateProductDto };
      }
      return product;
    }),
  }))
  .takeEvery(addProductAsync, function*({ addProductDto }, { select, put }) {
    console.log(`addProductDto`, addProductDto);
    const res = yield addProduct(addProductDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      console.log(res.data);
      message.success(`Add new product ${res.data.name} successfully`);
      router.push(`/admin/product`);
      return yield put(addProductSync({ newProduct: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  })
  .takeEvery(updateProductAsync, function*({ updateProductDto }, { select, put }) {
    console.log(`updateProductDto`, updateProductDto);
    const res = yield updateProduct(updateProductDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`Update product ${updateProductDto.name} successfully`);
      router.push(`/admin/product`);
      return yield put(updateProductSync({ updateProductDto }));
    } else {
      return yield message.error(res.msg);
    }
  });

export default productBuilder.build();

// {
//   status: ProductStatus.FOR_SALE,
//     imgs: [`image-1575405475318.jpg`],
//   _id: '1',
//   name: 'Manu',
//   desc: 'Manu Rodgers is the greatest of all time',
//   price: 2000,
//   pCategoryId: '5ddca2797fa0442cb4f99922',
//   categoryId: '5de03df7a76c8dfde755433e',
//   detail: '<p>hello manu <strong>goat</strong></p>',
//   __v: 0,
// },
// {
//   status: ProductStatus.FOR_SALE,
//     imgs: [`image-1575405475318.jpg`],
//   _id: '2',
//   name: 'Timmy',
//   desc: 'Timmy Duncan is the greatest of all time',
//   price: 2100,
//   pCategoryId: '5ddca2797fa0442cb4f99922',
//   categoryId: '5de043cda76c8dfde7554340',
//   detail: '<p>hello timmy</p>',
//   __v: 0,
// },
