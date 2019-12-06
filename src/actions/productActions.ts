import { actionCreatorFactory } from 'dva-model-creator';
import { IProduct } from '@/interfaces';
import { AddProductDto } from '@/dto/add-product.dto';
import { UpdateProductDto } from '@/dto/update-product.dto';
import { DeleteProductDto } from '@/dto/delete-product.dto';
import {UpdateProductStatusDto} from "@/dto/update-product-status.dto";

const productActionCreator = actionCreatorFactory('product');

// sync action creators
export const setProducts = productActionCreator<{ products: IProduct[] }>('setProducts');
export const setCurrentProduct = productActionCreator<{ currentProduct: IProduct }>(
  'setCurrentProduct',
);
//  add product
export const addProductAsync = productActionCreator<{ addProductDto: AddProductDto }>(
  'addProductAsync',
);
export const addProductSync = productActionCreator<{ newProduct: IProduct }>('addProductSync');

//  update product
export const updateProductAsync = productActionCreator<{ updateProductDto: UpdateProductDto }>(
  'updateProductAsync',
);
export const updateProductSync = productActionCreator<{
  updateProductDto: UpdateProductDto;
}>('updateProductSync');

//  update product status
export const updateProductStatusAsync = productActionCreator<{ updateProductStatusDto: UpdateProductStatusDto }>(
  'updateProductStatusAsync',
);
export const updateProductStatusSync = productActionCreator<{
  updateProductStatusDto: UpdateProductStatusDto;
}>('updateProductStatusSync');

// delete product
export const deleteProductAsync = productActionCreator<{ deleteProductDto: DeleteProductDto }>(
  'deleteProductAsync',
);
export const deleteProductSync = productActionCreator<{ deletedProduct: IProduct }>(
  'deleteProductSync',
);
