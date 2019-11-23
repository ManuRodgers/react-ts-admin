import React, { memo } from 'react';

import './Home.less';

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props: IHomeProps) => {
  return <div className={`home`}>Home Manu</div>;
};

export default memo(Home);
