import React, { memo } from 'react';

import './Product.less';

interface IProductProps {}

const Product: React.FunctionComponent<IProductProps> = (props: IProductProps) => {
  return <div className={`home`}>Product</div>;
};

export default memo(Product);
