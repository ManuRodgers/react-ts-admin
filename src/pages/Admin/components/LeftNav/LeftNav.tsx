import React, { memo, useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { withRouter, Link } from 'umi';

import Logo from '@/assets/images/logo.png';
import './LeftNav.less';
import { menuList, MenuList } from '@/config/menuList.config';
import { IUmiComponent } from '@/interfaces';
const { Sider } = Layout;
const { SubMenu } = Menu;
interface ILeftNavProps extends IUmiComponent {}

const LeftNav: React.FunctionComponent<ILeftNavProps> = ({ location, dispatch }) => {
  const { pathname } = location;
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
  const renderMenuNodes = (menuList: MenuList) => {
    return menuList.map(menu => {
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
