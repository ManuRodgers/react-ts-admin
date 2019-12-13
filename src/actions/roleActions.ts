import { actionCreatorFactory } from 'dva-model-creator';
import { IRole } from '@/interfaces';
import { AddRoleDto } from '@/dto/add-role.dto';
import { UpdateRoleDto } from '@/dto/update-role.dto';

const roleActionCreator = actionCreatorFactory('role');

// sync action creators
export const setRoles = roleActionCreator<{ roles: IRole[] }>('setRoles');
export const setCurrentRole = roleActionCreator<{ currentRole: IRole }>('setCurrentRole');

// add role
export const addRoleSync = roleActionCreator<{ role: IRole }>('addRoleSync');
export const addRoleAsync = roleActionCreator<{ addRoleDto: AddRoleDto }>('addRoleAsync');

// update role
export const updateRoleSync = roleActionCreator<{ role: IRole }>('updateRoleSync');
export const updateRoleAsync = roleActionCreator<{ updateRoleDto: UpdateRoleDto }>(
  'updateRoleAsync',
);
