import * as React from 'react';

import './basicLayout.less';
interface IBasicLayoutProps {}

const BasicLayout: React.FunctionComponent<IBasicLayoutProps> = ({ children }) => {
  return <div className={`basic-layout`}>{children}</div>;
};

export default BasicLayout;
