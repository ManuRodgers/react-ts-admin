import * as React from 'react';

interface IBasicLayoutProps {}

const BasicLayout: React.FunctionComponent<IBasicLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default BasicLayout;
