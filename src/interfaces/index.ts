import { Dispatch } from 'dva';
import { RouterTypes } from 'umi';

export interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
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
