import { DvaModelBuilder } from 'dva-model-creator';
import { IGlobalState, IRole } from '@/interfaces';
import {
  setCurrentRole,
  setRoles,
  addRoleSync,
  addRoleAsync,
  updateRoleSync,
  updateRoleAsync,
} from '@/actions/roleActions';
import { message } from 'antd';
import { router } from 'umi';
import { addRole, updateRole } from '@/api';

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
        return { ...item, menus: role.menus };
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
  // TODO:
  .takeEvery(updateRoleAsync, function*({ updateRoleDto }, { select, put }) {
    console.log(`updateProductDto`, updateRoleDto);
    const res = yield updateRole(updateRoleDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`update role permission successfully`);
      console.log(`res.data`, res.data);
      // router.push(`/admin/product`);
      return yield put(updateRoleSync({ role: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  });

export default roleBuilder.build();
