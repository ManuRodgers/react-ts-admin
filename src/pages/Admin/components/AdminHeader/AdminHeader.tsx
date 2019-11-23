import React, { memo, useState, useEffect } from 'react';
import { Redirect, withRouter } from 'umi';
import dayjs from 'dayjs';
import { Layout } from 'antd';

import Logo from '@/assets/images/logo.png';
import { menuList, MenuList } from '@/config/menuList.config';
import memoryUtils from '@/utils/memoryUtils';
import { IUmiComponent, IUser } from '@/interfaces';
import './AdminHeader.less';

const { Header } = Layout;

interface IAdminHeaderProps extends IUmiComponent {}

const AdminHeader: React.FunctionComponent<IAdminHeaderProps> = ({ location }) => {
  const { pathname } = location;

  // currentTime
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const timeInterval = setInterval(() => {
      const now = dayjs().format(`YYYY-MM-DD HH:mm:ss (ddd)`);
      setCurrentTime(now);
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [currentTime]);
  // title
  const [title, setTitle] = useState<string>('');
  useEffect(() => {
    menuList.forEach(menu => {
      if (menu.key === pathname) {
        setTitle(menu.title);
        console.log(`title`, title);
      } else if (menu.children) {
        const cMenu = menu.children.find(cMenu => cMenu.key === pathname);
        if (cMenu) {
          setTitle(cMenu.title);
          console.log(`title`, title);
        }
      }
    });
  }, [title, pathname]);

  const currentUser = memoryUtils.user as IUser;
  if (!currentUser || !currentUser._id) {
    return <Redirect to={`/login`} />;
  }
  return (
    <Header className={'admin-header'}>
      <div className={`admin-header-top`}>
        <span>welcome, {currentUser.username}</span>
        <a href="javascript:">Log out</a>
      </div>
      <div className={`admin-header-bottom`}>
        <div className="admin-header-bottom-left">{title}</div>
        <div className="admin-header-bottom-right">
          <span>{currentTime}</span>
          <img src={Logo} alt="weather" />
          <span>Cloudy</span>
        </div>
      </div>
    </Header>
  );
};

export default memo(withRouter(AdminHeader));
