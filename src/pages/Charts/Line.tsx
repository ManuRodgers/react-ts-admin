import React, { memo } from 'react';

import './Line.less';

interface ILineProps {}

const Line: React.FunctionComponent<ILineProps> = (props: ILineProps) => {
  return <div className={`home`}>Line</div>;
};

export default memo(Line);
