import { DvaModelBuilder } from 'dva-model-creator';
import { IGlobalState, IUser } from '@/interfaces';
import {
  setUsers,
  setCurrentUser,
  addUserAsync,
  addUserSync,
  updateUserAsync,
  updateUserSync,
  deleteUserAsync,
  deleteUserSync,
} from '@/actions/userActions';
import { message } from 'antd';
import { addUser, updateUser, deleteUser } from '@/api';

const initState: IGlobalState['user'] = {
  users: [],
  currentUser: {} as IUser,
};
const userBuilder = new DvaModelBuilder(initState, 'user')
  .case(setCurrentUser, (state, { currentUser }) => ({ ...state, currentUser }))
  .case(setUsers, (state, { users }) => ({ ...state, users }))
  .case(addUserSync, (state, { user }) => ({ ...state, users: [...state.users, user] }))
  .case(updateUserSync, (state, { user }) => ({
    ...state,
    users: state.users.map(item => {
      if (item._id === user._id) {
        return user;
      } else {
        return item;
      }
    }),
  }))
  .case(deleteUserSync, (state, { userId }) => ({
    ...state,
    users: state.users.filter(user => user._id !== userId),
  }))
  .takeEvery(addUserAsync, function*({ addUserDto }, { select, put }) {
    const res = yield addUser(addUserDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`add user successfully`);
      // router.push(`/admin/product`);
      return yield put(addUserSync({ user: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  })
  .takeEvery(updateUserAsync, function*({ updateUserDto }, { select, put }) {
    const res = yield updateUser(updateUserDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`update user successfully`);
      // router.push(`/admin/product`);
      return yield put(updateUserSync({ user: res.data }));
    } else {
      return yield message.error(res.msg);
    }
  })
  .takeEvery(deleteUserAsync, function*({ deleteUserDto }, { select, put }) {
    const res = yield deleteUser(deleteUserDto);
    yield console.log(`res`, res);
    if (res.status === 0) {
      message.success(`delete user successfully`);
      // router.push(`/admin/product`);
      return yield put(deleteUserSync({ userId: deleteUserDto.userId }));
    } else {
      return yield message.error(res.msg);
    }
  });

export default userBuilder.build();
