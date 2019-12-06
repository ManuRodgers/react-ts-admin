import { DvaModelBuilder } from 'dva-model-creator';
import { IGlobalState } from '@/interfaces';
import { setCurrentRole, setRoles } from '@/actions/roleActions';
import { message } from 'antd';
import { router } from 'umi';

const initState: IGlobalState['role'] = {
  roles: [
    {
      __v: 0,
      _id: '1',
      auth_name: 'admin',
      auth_time: Date.now(),
      create_time: Date.now(),
      name: 'manager',
      menus: [],
    },
  ],
};
const roleBuilder = new DvaModelBuilder(initState, 'role')
  .case(setRoles, (state, { roles }) => ({
    ...state,
    roles,
  }))
  .case(setCurrentRole, (state, { currentRole }) => ({ ...state, currentRole }));

export default roleBuilder.build();
