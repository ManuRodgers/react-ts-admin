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
import { addUserAsync, deleteUserAsync, setUsers } from '@/actions/userActions';

const mapStateToProps = ({ user, role }: IGlobalState) => ({
  user,
  role,
});
type UserStateProps = ReturnType<typeof mapStateToProps>;
interface IUserProps extends IUmiComponent, UserStateProps {}

const User: React.FunctionComponent<IUserProps> = ({ user, dispatch, role }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
              }}
            >
              Update
            </LinkButton>
            <LinkButton
              onClick={() => {
                dispatch(deleteUserAsync({ deleteUserDto: { userId: user._id } }));
              }}
            >
              remove
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
      }}
      type={'primary'}
    >
      Add User
    </Button>
  );
  const handleModelOk = useCallback(() => {
    console.log(`handleModelOk`);
    const { resetFields, validateFields } = userForm;
    validateFields((err: any, user: any) => {
      if (!err) {
        dispatch(addUserAsync({ addUserDto: user }));
        console.log(`user`, user);
        resetFields();
        setIsModalVisible(false);
      }
    });
  }, [userForm, dispatch]);

  const handleModelCancel = useCallback(() => {
    setIsModalVisible(false);
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
        title="Add User"
        visible={isModalVisible}
        onOk={handleModelOk}
        onCancel={handleModelCancel}
      >
        <UserForm
          getUserForm={form => {
            setUserForm(form);
          }}
          roles={roles}
        />
      </Modal>
    </Card>
  );
};

export default memo(connect(mapStateToProps)(User));
