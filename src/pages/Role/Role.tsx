import React, { memo } from 'react';
import { ColumnProps } from 'antd/es/table';
import { Table, Button, Card } from 'antd';
import { connect } from 'react-redux';
import { IGlobalState, IRole, IUmiComponent } from '@/interfaces';
import { PAGE_SIZE } from '@/utils/constant';
import './Role.less';

const mapStateToProps = ({ role }: IGlobalState) => ({
  role,
});
type RoleStateProps = ReturnType<typeof mapStateToProps>;
interface IRoleProps extends IUmiComponent, RoleStateProps {}

const Role: React.FunctionComponent<IRoleProps> = ({ role }) => {
  console.log(`role`, role);
  const { roles } = role;
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
      <Button type={'primary'} style={{ marginRight: 10 }}>
        Add Role
      </Button>
      <Button type={'primary'} disabled={true}>
        Set Role Permissions
      </Button>
    </span>
  );
  return (
    <Card title={title} className={`role`}>
      <Table<IRole>
        bordered={true}
        rowKey={'_id'}
        dataSource={roles}
        columns={columns}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
};

export default memo(connect(mapStateToProps)(Role));
