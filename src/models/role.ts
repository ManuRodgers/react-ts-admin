import { DvaModelBuilder } from 'dva-model-creator';
import { router } from 'umi';
import { IGlobalState, IRole, IUser } from '@/interfaces';
import {
  setCurrentRole,
  setRoles,
  addRoleSync,
  addRoleAsync,
  updateRoleSync,
  updateRoleAsync,
} from '@/actions/roleActions';
import { message } from 'antd';
import { addRole, updateRole } from '@/api';
import memoryUtils from '@/utils/memoryUtils';
import storageUtils from '@/utils/storageUtils';

const initState: IGlobalState['role'] = {
  roles: [],
  currentRole: {} as IRole,
};
const roleBuilder = new DvaModelBuilder(initState, 'role')
  .case(setRoles, (state, { roles }) => ({
    ...state,
    roles,
  }))
  .case(setCurrentRole, (state, { currentRole }) => ({ ...state, currentRole }))
  .case(addRoleSync, (state, { role }) => ({ ...state, roles: [...state.roles, role] }))
  .case(updateRoleSync, (state, { role }) => ({
    ...state,
    roles: state.roles.map(item => {
      if (item._id === role._id) {
        return { ...item, menus: role.menus, auth_name: role.auth_name, auth_time: role.auth_time };
      }
      return item;
    }),
  }))
  .takeEvery(addRoleAsync, function*({ addRoleDto }, { select, put }) {
    console.log(`updateProductDto`, addRoleDto);
    const res = yield addRole(addRoleDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`add role successfully`);
      // router.push(`/admin/product`);
      return yield put(addRoleSync({ role: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  })
  .takeEvery(updateRoleAsync, function*({ updateRoleDto }, { select, put }) {
    console.log(`updateProductDto`, updateRoleDto);
    const res = yield updateRole(updateRoleDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      console.log(`res.data`, res.data);
      const role = res.data as IRole;
      // to see whether the current user is logged in
      const currentUser = memoryUtils.user as IUser;
      if (currentUser.role_id === role._id) {
        console.log(`currentUser.role_id === role._id`);
        yield put(updateRoleSync({ role }));
        message.info(`Current role permission has been changed, Please login again`);
        storageUtils.removeUser();
        memoryUtils.user = {};
        return router.push('/login');
      } else {
        console.log(`different role`);
        message.success(`update role permission successfully`);
        return yield put(updateRoleSync({ role }));
      }
      // router.push(`/admin/product`);
    } else {
      return yield message.error(res.msg);
    }
  });

export default roleBuilder.build();
