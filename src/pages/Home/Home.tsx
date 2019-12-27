import React, { memo } from 'react';
import { Descriptions } from 'antd';

import './Home.less';
import memoryUtils from '@/utils/memoryUtils';
import { IUser } from '@/interfaces';

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props: IHomeProps) => {
  const currentUser = memoryUtils.user as IUser;
  console.log(`currentUser`, currentUser);
  return (
    <Descriptions title="Project Description">
      <Descriptions.Item>
        this react backstage management system is written by Jingxi Liao(Manu) with React,
        Dva(Redux), Umi(React-Router and Webpack) and everything is written in typescript
      </Descriptions.Item>
    </Descriptions>
  );
};

export default memo(Home);
