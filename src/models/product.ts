import { DvaModelBuilder } from 'dva-model-creator';
import {
  setProducts,
  setCurrentProduct,
  addProductAsync,
  addProductSync,
  updateProductAsync,
  updateProductSync,
  updateProductStatusAsync,
  updateProductStatusSync,
  deleteProductAsync,
  deleteProductSync,
} from '@/actions/productActions';
import { IGlobalState } from '@/interfaces';
import { ProductStatus } from '@/enums';
import { addProduct, updateProduct, updateProductStatus } from '@/api';
import { message } from 'antd';
import { router } from 'umi';

const initState: IGlobalState['product'] = {
  products: [],
  currentProduct: {
    imgs: [],
    detail: '',
    status: ProductStatus.FOR_SALE,
  },
};
// @ts-ignore
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
  .case(updateProductStatusSync, (state, { updateProductStatusDto }) => ({
    ...state,
    products: state.products.map(product => {
      if (product._id === updateProductStatusDto.productId) {
        return { ...product, status: updateProductStatusDto.status };
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
  })
  .takeEvery(updateProductStatusAsync, function*({ updateProductStatusDto }, { select, put }) {
    console.log(`updateProductDto`, updateProductStatusDto);
    const res = yield updateProductStatus(updateProductStatusDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`Update product status successfully`);
      router.push(`/admin/product`);
      return yield put(updateProductStatusSync({ updateProductStatusDto }));
    } else {
      return yield message.error(res.msg);
    }
  });

export default productBuilder.build();
