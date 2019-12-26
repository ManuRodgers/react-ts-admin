import React, { memo, useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { withRouter, Link } from 'umi';

import Logo from '@/assets/images/logo.png';
import './LeftNav.less';
import { menuList, MenuList, IMenu } from '@/config/menuList.config';
import { IUmiComponent, IUser } from '@/interfaces';
import memoryUtils from '@/utils/memoryUtils';
const { Sider } = Layout;
const { SubMenu } = Menu;
interface ILeftNavProps extends IUmiComponent {}

const LeftNav: React.FunctionComponent<ILeftNavProps> = ({ location, dispatch }) => {
  let pathname = location.pathname;
  const currentUser = memoryUtils.user as IUser;
  console.log(`currentUser`, currentUser);
  if (pathname.startsWith(`/admin/product`)) {
    pathname = `/admin/product`;
  }
  // submenu keys of first level
  const rootSubmenuKeys = menuList
    .filter(menu => menu.children)
    .map(filteredMenu => filteredMenu.key);
  const [openKeys, setOpenKeys] = useState<string[]>([rootSubmenuKeys[0]]);
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const hasAuth = (menu: IMenu): boolean => {
    if (currentUser.username === 'admin') {
      console.log(`currentUser.username === 'admin'`);
      return true;
    }
    if (menu.isPublic) {
      return true;
    }
    if (currentUser.role) {
      if (currentUser.role.name === 'admin') {
        return true;
      }
      if (currentUser.role.menus.indexOf(menu.key) !== -1) {
        return true;
      }
    }

    return false;
  };
  const renderMenuNodes = (menuList: MenuList) => {
    return menuList.map(menu => {
      if (hasAuth(menu)) {
        if (!menu.children) {
          return (
            <Menu.Item key={menu.key}>
              <Link to={menu.key}>
                <Icon type={menu.icon} />
                <span>{menu.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          return (
            <SubMenu
              key={menu.key}
              title={
                <span>
                  <Icon type={menu.icon} />
                  <span>{menu.title}</span>
                </span>
              }
            >
              {renderMenuNodes(menu.children)}
            </SubMenu>
          );
        }
      } else {
        return null;
      }
    });
  };
  return (
    <Sider className={`left-nav`}>
      <header className={`left-nav-header`}>
        <img src={Logo} alt="logo" />
        <span>Admin</span>
      </header>
      <Menu
        onOpenChange={onOpenChange}
        openKeys={openKeys}
        selectedKeys={[pathname]}
        mode="inline"
        theme="dark"
      >
        {renderMenuNodes(menuList)}
      </Menu>
    </Sider>
  );
};

export default memo(withRouter(LeftNav));
