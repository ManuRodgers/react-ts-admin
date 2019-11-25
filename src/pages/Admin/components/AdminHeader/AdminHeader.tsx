import React, { memo, useState, useEffect } from 'react';
import { Redirect, router, withRouter } from 'umi';
import dayjs from 'dayjs';
import { Layout, Modal } from 'antd';

import Logo from '@/assets/images/logo.png';
import { menuList, MenuList } from '@/config/menuList.config';
import memoryUtils from '@/utils/memoryUtils';
import { IUmiComponent, IUser } from '@/interfaces';
import './AdminHeader.less';
import LinkButton from '@/components/LinkButton/LinkButton';
import storageUtils from '@/utils/storageUtils';

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
      } else if (menu.children) {
        const cMenu = menu.children.find(cMenu => cMenu.key === pathname);
        if (cMenu) {
          setTitle(cMenu.title);
        }
      }
    });
  }, [title, pathname]);

  const currentUser = memoryUtils.user as IUser;
  if (!currentUser || !currentUser._id) {
    return <Redirect to={`/login`} />;
  }

  const handleLogOutClicked: React.MouseEventHandler<HTMLButtonElement> = () => {
    Modal.confirm({
      title: 'Do you Want to log out?',
      onOk() {
        memoryUtils.user = {};
        storageUtils.removeUser();
        router.replace(`/login`);
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  return (
    <Header className={'admin-header'}>
      <div className={`admin-header-top`}>
        <span>welcome, {currentUser.username}</span>
        <LinkButton onClick={handleLogOutClicked}>Log out</LinkButton>
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
