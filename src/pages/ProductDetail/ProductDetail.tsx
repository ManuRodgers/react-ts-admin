import React, { memo } from 'react';
import { connect } from 'dva';

import './ProductDetail.less';
import { IGlobalState, IUmiComponent } from '@/interfaces';
const mapStateToProps = ({ product }: IGlobalState) => ({
  product,
});

type ProductDetailStateProps = ReturnType<typeof mapStateToProps>;

interface IProductDetailProps extends IUmiComponent, ProductDetailStateProps {}

const ProductDetail: React.FunctionComponent<IProductDetailProps> = ({ product }) => {
  return <div className={`product-detail`}>ProductDetail</div>;
};

export default memo(connect(mapStateToProps)(ProductDetail));
