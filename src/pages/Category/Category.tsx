import React, { memo } from 'react';

import './Category.less';

interface ICategoryProps {}

const Category: React.FunctionComponent<ICategoryProps> = (props: ICategoryProps) => {
  return <div className={`home`}>Category</div>;
};

export default memo(Category);
