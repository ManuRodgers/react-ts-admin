import React, { memo, useCallback, useEffect, useState } from 'react';
import { Form, Input, Tree } from 'antd';
import { IRole } from '@/interfaces';
import { MenuList, menuList } from '@/config/menuList.config';

const { TreeNode } = Tree;

interface IRolePermissionFormProps {
  currentRole?: IRole;
  getCheckedKeys: (checkedKeys: string[]) => void;
}

const RolePermissionForm: React.FunctionComponent<IRolePermissionFormProps> = ({
  currentRole,
  getCheckedKeys,
}) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(currentRole ? currentRole.menus : []);
  console.log(`checkedKeys`, checkedKeys);
  console.log(`currentRole`, currentRole);
  useEffect(() => {
    if (currentRole) {
      currentRole.menus = checkedKeys;
    }
  }, [currentRole, checkedKeys]);

  useEffect(() => {
    getCheckedKeys(checkedKeys);
  }, [checkedKeys, getCheckedKeys]);
  const getTreeNodes = useCallback((menuList: MenuList) => {
    return menuList.map(menu => {
      if (menu.children) {
        return (
          <TreeNode title={menu.title} key={menu.key}>
            {getTreeNodes(menu.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={menu.title} key={menu.key} />;
      }
    });
  }, []);
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
      layout={'horizontal'}
      className={`role-permission-form`}
    >
      <Form.Item label={`Role Name`}>
        <Input value={currentRole && currentRole.name} disabled={true} />
      </Form.Item>
      <Form.Item>
        <Tree
          onCheck={checkedKeys => {
            setCheckedKeys(checkedKeys as string[]);
          }}
          checkedKeys={currentRole && currentRole.menus.length > 0 ? currentRole.menus : []}
          checkable={true}
          defaultExpandAll={true}
        >
          <TreeNode title="Platform Permissions" key="all">
            {getTreeNodes(menuList)}
          </TreeNode>
        </Tree>
      </Form.Item>
    </Form>
  );
};

export default memo(RolePermissionForm);
