import React, { memo } from 'react';

import './Pie.less';

interface IPieProps {}

const Pie: React.FunctionComponent<IPieProps> = (props: IPieProps) => {
  return <div className={`home`}>Pie</div>;
};

export default memo(Pie);
