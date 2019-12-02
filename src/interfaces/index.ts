import { Dispatch } from 'dva';
import { RouterTypes } from 'umi';
import { ProductStatus } from '@/enums';
import React from 'react';

export interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
}

export interface IGlobalState {
  category: ICategoryModel;
  product: IProductModel;
}

export interface ICategoryModel {
  categories: ICategory[];
  subCategories: ICategory[];
  currentCategory: ICategory;
  parentId: string;
}

export interface IProductModel {
  products: IProduct[];
  currentProduct: IProduct;
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  create_time: number;
  role_id: string;
}

export interface ICategory {
  name: string;
  parentId: string;
  _id: string;
}
export interface IProduct {
  categoryId?: string;
  pCategoryId?: string;
  name?: string;
  price?: number;
  desc?: string;
  status?: ProductStatus.FOR_SALE;
  imgs?: JSON[];
  detail?: string;
  _id?: string;
  __v?: number;
}
