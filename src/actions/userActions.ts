import { actionCreatorFactory } from 'dva-model-creator';
import { IUser } from '@/interfaces';
import { AddUserDto } from '@/dto/add-user.dto';
import { DeleteUserDto } from '@/dto/delete-user.dto';

const userActionCreator = actionCreatorFactory('user');

// sync action creators
export const setUsers = userActionCreator<{ users: IUser[] }>('setUsers');
export const setCurrentUser = userActionCreator<{ currentUser: IUser }>('setCurrentUser');

// add user
export const addUserSync = userActionCreator<{ user: IUser }>('addUserSync');
export const addUserAsync = userActionCreator<{ addUserDto: AddUserDto }>('addUserAsync');

// delete user
export const deleteUserSync = userActionCreator<{ userId: string }>('deleteUserSync');
export const deleteUserAsync = userActionCreator<{ deleteUserDto: DeleteUserDto }>(
  'deleteUserAsync',
);
