import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import { Table, Button, Card, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { IGlobalState, IRole, IUmiComponent } from '@/interfaces';
import { PAGE_SIZE } from '@/utils/constant';
import './Role.less';
import { addRoleAsync, setCurrentRole, setRoles, updateRoleAsync } from '@/actions/roleActions';
import AddRoleForm from '@/pages/Role/components/AddRoleForm';
import { useRoles } from '@/hooks';
import RolePermissionForm from '@/pages/Role/components/RolePermissionForm';
import { UpdateRoleDto } from '@/dto/update-role.dto';
import memoryUtils from '@/utils/memoryUtils';
import dayjs from 'dayjs';
const mapStateToProps = ({ role }: IGlobalState) => ({
  role,
});
type RoleStateProps = ReturnType<typeof mapStateToProps>;
interface IRoleProps extends IUmiComponent, RoleStateProps {}

const Role: React.FunctionComponent<IRoleProps> = ({ role, dispatch }) => {
  const { roles, currentRole } = role;
  const [checkedKeys, setCheckedKeys] = useState<string[]>(currentRole ? currentRole.menus : []);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(['']);
  const [addRoleForm, setAddRoleForm] = useState();
  const [isAddRoleModalVisible, setIsAddRoleModalVisible] = useState<boolean>(false);
  const [isSetRolePermissionModalVisible, setIsSetRolePermissionModalVisible] = useState<boolean>(
    false,
  );

  // get roles from server or cache
  const { data: rolesData, error: rolesError } = useRoles();
  useEffect(() => {
    if (rolesError) {
      message.error(rolesError);
    } else if (rolesData && rolesData.status === 0) {
      console.log(`rolesData`, rolesData);
      dispatch(setRoles({ roles: rolesData.data }));
    }
  }, [rolesData, rolesError, dispatch]);

  const modifiedRoles = useMemo(() => {
    return roles.map(role => {
      return {
        ...role,
        create_time: dayjs(role.create_time).format('YYYY-MM-DD HH:mm:ss'),
        auth_time: dayjs(role.auth_time).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
  }, [roles]);

  const columns: ColumnProps<IRole>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Created Time',
      dataIndex: 'create_time',
    },
    {
      title: 'Auth Time',
      dataIndex: 'auth_time',
    },
    {
      title: 'Auth Name',
      dataIndex: 'auth_name',
    },
  ];
  const title = (
    <span>
      <Button
        onClick={() => {
          setIsAddRoleModalVisible(true);
        }}
        type={'primary'}
        style={{ marginRight: 10 }}
      >
        Add Role
      </Button>
      <Button
        onClick={() => {
          setIsSetRolePermissionModalVisible(true);
        }}
        type={'primary'}
        disabled={currentRole && !currentRole._id}
      >
        Set Role Permissions
      </Button>
    </span>
  );

  const handleAddRoleOk: React.MouseEventHandler<HTMLElement> = useCallback(() => {
    const { resetFields, validateFields } = addRoleForm;
    validateFields((error: any, values: any) => {
      console.error();
      if (!error) {
        const { roleName } = values;
        dispatch(addRoleAsync({ addRoleDto: { roleName } }));
        setIsAddRoleModalVisible(false);
        resetFields();
      }
    });
  }, [addRoleForm, dispatch]);

  const handleAddRoleCancel: React.MouseEventHandler<HTMLElement> = useCallback(() => {
    setIsAddRoleModalVisible(false);
    addRoleForm.resetFields();
  }, [addRoleForm]);

  const handleSetRolePermissionOk: React.MouseEventHandler<HTMLElement> = useCallback(() => {
    console.log(`currentRole`, currentRole);
    console.log(`checkedKeys`, checkedKeys);
    if (currentRole) {
      // @ts-ignore
      currentRole.auth_name = memoryUtils.user.username;
    }
    dispatch(
      updateRoleAsync({
        updateRoleDto: {
          ...currentRole,
          menus: checkedKeys,
        } as UpdateRoleDto,
      }),
    );
    setIsSetRolePermissionModalVisible(false);
  }, [currentRole, checkedKeys, dispatch]);

  const handleSetRolePermissionCancel: React.MouseEventHandler<HTMLElement> = useCallback(() => {
    setIsSetRolePermissionModalVisible(false);
  }, []);
  return (
    <Card title={title} className={`role`}>
      <Table<IRole>
        onRow={(role: IRole) => {
          return {
            onClick: () => {
              dispatch(setCurrentRole({ currentRole: role }));
              setSelectedRowKeys([role._id as string]);
            },
          };
        }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            dispatch(setCurrentRole({ currentRole: selectedRows[0] }));
          },
        }}
        bordered={true}
        rowKey={'_id'}
        dataSource={roles}
        columns={columns}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
        }}
      />
      <Modal
        title="Add Role"
        visible={isAddRoleModalVisible}
        onOk={handleAddRoleOk}
        onCancel={handleAddRoleCancel}
      >
        <AddRoleForm
          getAddRoleForm={form => {
            setAddRoleForm(form);
          }}
        />
      </Modal>
      <Modal
        title="Set Role Permission"
        visible={isSetRolePermissionModalVisible}
        onOk={handleSetRolePermissionOk}
        onCancel={handleSetRolePermissionCancel}
      >
        <RolePermissionForm
          getCheckedKeys={checkedKeys => {
            setCheckedKeys(checkedKeys);
          }}
          currentRole={currentRole}
        />
      </Modal>
    </Card>
  );
};

export default memo(connect(mapStateToProps)(Role));
