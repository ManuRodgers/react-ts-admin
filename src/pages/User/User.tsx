import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import { Table, Button, Card, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { IGlobalState, IUser, IUmiComponent, IRoleIdName } from '@/interfaces';
import { PAGE_SIZE } from '@/utils/constant';

import './User.less';
import LinkButton from '@/components/LinkButton/LinkButton';
import UserForm from '@/pages/User/components/UserForm';
import { useRoles, useUsers } from '@/hooks';
import { setRoles } from '@/actions/roleActions';
import {
  addUserAsync,
  updateUserAsync,
  deleteUserAsync,
  setCurrentUser,
  setUsers,
} from '@/actions/userActions';

const mapStateToProps = ({ user, role }: IGlobalState) => ({
  user,
  role,
});
type UserStateProps = ReturnType<typeof mapStateToProps>;
interface IUserProps extends IUmiComponent, UserStateProps {}

const User: React.FunctionComponent<IUserProps> = ({ user, dispatch, role }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [userForm, setUserForm] = useState();
  console.log(`userForm`, userForm);
  const { users, currentUser } = user;
  const { roles } = role;

  const { data: rolesData, error: rolesError } = useRoles();
  useEffect(() => {
    if (rolesError) {
      message.error(rolesError);
    } else if (rolesData && rolesData.status === 0) {
      console.log(`rolesData`, rolesData);
      dispatch(setRoles({ roles: rolesData.data }));
    }
  }, [rolesData, rolesError, dispatch]);
  console.log(`roles`, roles);

  const { data: usersData, error: usersError } = useUsers();
  useEffect(() => {
    if (usersError) {
      message.error(usersError);
    } else if (usersData && usersData.status === 0) {
      console.log(`usersData`, usersData);
      // @ts-ignore
      dispatch(setUsers({ users: usersData.data.users }));
    }
  }, [usersData, usersError, dispatch]);

  let roleIdName: IRoleIdName = {};
  roles.forEach(role => {
    // @ts-ignore
    roleIdName[role._id] = role.name;
  });
  const columns: ColumnProps<IUser>[] = [
    {
      title: 'Username',
      dataIndex: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Created Time',
      dataIndex: 'create_time',
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      render: (text, user) => {
        return roleIdName[user.role_id];
      },
    },
    {
      title: 'Operation',
      render: (text, user) => {
        return (
          <span>
            <LinkButton
              onClick={() => {
                console.log(`update clicked`);
                setIsModalVisible(true);
                setIsUpdatingUser(true);
                dispatch(setCurrentUser({ currentUser: user }));
              }}
            >
              Update
            </LinkButton>
            <LinkButton
              onClick={() => {
                setIsDeleteModalVisible(true);
                dispatch(setCurrentUser({ currentUser: user }));
              }}
            >
              Remove
            </LinkButton>
          </span>
        );
      },
    },
  ];
  const title = (
    <Button
      onClick={() => {
        setIsModalVisible(true);
        dispatch(setCurrentUser({ currentUser: {} as IUser }));
      }}
      type={'primary'}
    >
      Add User
    </Button>
  );
  // add modal
  const handleModelOk = useCallback(() => {
    console.log(`handleModelOk`);
    const { resetFields, validateFields } = userForm;

    if (isUpdatingUser) {
      // for update user
      setIsUpdatingUser(false);
      validateFields((err: any, user: any) => {
        if (!err) {
          dispatch(updateUserAsync({ updateUserDto: { ...user, _id: currentUser._id } }));
          resetFields();
          setIsModalVisible(false);
        }
      });
    } else {
      //  for add user
      validateFields((err: any, user: any) => {
        if (!err) {
          dispatch(addUserAsync({ addUserDto: user }));
          console.log(`user`, user);
          resetFields();
          setIsModalVisible(false);
        }
      });
      console.log(`isUpdatingUser`, isUpdatingUser);
    }
  }, [userForm, dispatch, isUpdatingUser, currentUser]);

  const handleModelCancel = useCallback(() => {
    setIsModalVisible(false);
    if (isUpdatingUser) {
      setIsUpdatingUser(false);
    }
  }, [isUpdatingUser]);

  // delete modal
  const handleDeleteModelOk = useCallback(() => {
    if (currentUser) {
      dispatch(deleteUserAsync({ deleteUserDto: { userId: currentUser._id } }));
      setIsDeleteModalVisible(false);
    }
  }, [dispatch, currentUser]);

  const handleDeleteModelCancel = useCallback(() => {
    setIsDeleteModalVisible(false);
  }, []);
  return (
    <Card title={title} className={`role`}>
      <Table<IUser>
        bordered={true}
        rowKey={'_id'}
        dataSource={users}
        columns={columns}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
        }}
      />
      <Modal
        title={isUpdatingUser ? 'Update User' : 'Add User'}
        visible={isModalVisible}
        onOk={handleModelOk}
        onCancel={handleModelCancel}
      >
        <UserForm
          getUserForm={form => {
            setUserForm(form);
          }}
          roles={roles}
          currentUser={currentUser}
        />
      </Modal>
      <Modal
        title="Delete User"
        visible={isDeleteModalVisible}
        onOk={handleDeleteModelOk}
        onCancel={handleDeleteModelCancel}
      >
        Are you sure you want to delete{` `}
        <span style={{ color: '#f00' }}>{currentUser && currentUser.username}</span>?
      </Modal>
    </Card>
  );
};

export default memo(connect(mapStateToProps)(User));
