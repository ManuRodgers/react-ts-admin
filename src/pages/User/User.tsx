import React, { memo } from 'react';

import './User.less';

interface IUserProps {}

const User: React.FunctionComponent<IUserProps> = (props: IUserProps) => {
  return <div className={`home`}>User</div>;
};

export default memo(User);
