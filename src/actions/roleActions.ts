import { actionCreatorFactory } from 'dva-model-creator';
import { IRole } from '@/interfaces';

const roleActionCreator = actionCreatorFactory('role');

// sync action creators
export const setRoles = roleActionCreator<{ roles: IRole[] }>('setRoles');
export const setCurrentRole = roleActionCreator<{ currentRole: IRole }>('setCurrentRole');
