import { Dispatch } from 'dva';
import { RouterTypes } from 'umi';
import { ProductStatus } from '@/enums';

export interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
}

export interface IGlobalState {
  category: ICategoryModel;
  product: IProductModel;
  role: IRoleModel;
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
export interface IRoleModel {
  roles: IRole[];
  currentRole?: IRole;
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
  status: number;
  imgs: string[];
  detail: string;
  _id?: string;
  __v?: number;
}
export interface IRole {
  name: string;
  auth_name: string;
  auth_time: number;
  create_time: number;
  menus: string[];
  _id?: string;
  __v?: number;
}
