import React, { memo } from 'react';

import './Bar.less';

interface IBarProps {}

const Bar: React.FunctionComponent<IBarProps> = (props: IBarProps) => {
  return <div className={`home`}>Bar</div>;
};

export default memo(Bar);
