import { Dispatch } from 'dva';
import { RouterTypes } from 'umi';

export interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
}

export interface IGlobalState {
  category: ICategoryModel;
}

export interface ICategoryModel {
  categories: ICategory[];
  subCategories: ICategory[];
  currentCategory: ICategory;
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
