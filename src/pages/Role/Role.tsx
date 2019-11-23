import React, { memo } from 'react';

import './Role.less';

interface IRoleProps {}

const Role: React.FunctionComponent<IRoleProps> = (props: IRoleProps) => {
  return <div className={`home`}>Role</div>;
};

export default memo(Role);
