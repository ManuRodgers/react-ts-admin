import React, { memo, useState, useEffect } from 'react';
import { Card, Icon, List, message } from 'antd';
import { connect } from 'dva';

import './ProductDetail.less';
import { IGlobalState, IProduct, IUmiComponent } from '@/interfaces';
import { router } from 'umi';
import { BASE_IMG_URL } from '@/utils/constant';
import { useCategory } from '@/hooks';
const mapStateToProps = ({ product }: IGlobalState) => ({
  product,
});

type ProductDetailStateProps = ReturnType<typeof mapStateToProps>;

interface IProductDetailProps extends IUmiComponent, ProductDetailStateProps {}

const ProductDetail: React.FunctionComponent<IProductDetailProps> = ({ product, location }) => {
  const [currentProduct, setCurrentProduct] = useState<IProduct>(location.state as IProduct);
  const [categoryName, setCategoryName] = useState<string>('');
  const [pCategoryName, setPCategoryName] = useState<string>('');
  console.log(`currentProduct`, currentProduct);
  console.log(`pCategoryName`, pCategoryName);
  const categoryId = currentProduct.categoryId || '';
  const { data: category, error: categoryError } = useCategory(categoryId);
  useEffect(() => {
    if (categoryError) {
      message.error(categoryError.message);
    } else if (category && category.status === 0) {
      setCategoryName(category.data.name);
    }
  }, [categoryError, category]);

  const pCategoryId = currentProduct.pCategoryId || '0';
  const { data: pCategory, error: pCategoryError } = useCategory(pCategoryId);
  useEffect(() => {
    if (pCategoryError) {
      message.error(pCategoryError.message);
    } else if (pCategory && pCategory.status === 0) {
      setPCategoryName(pCategory.data.name);
    }
  }, [pCategoryError, pCategory]);

  const title = (
    <span>
      <Icon
        onClick={() => {
          router.goBack();
        }}
        style={{ color: `#1DA57A`, marginRight: 15 }}
        type={`arrow-left`}
      />
      <span>Product Detail</span>
    </span>
  );
  return (
    <Card title={title} className={`product-detail`}>
      {currentProduct._id ? (
        <List itemLayout={'vertical'}>
          <List.Item>
            <span className={`product-detail-left`}>Name:</span>
            <span>{currentProduct.name}</span>
          </List.Item>
          <List.Item>
            <span className={`product-detail-left`}>Description:</span>
            <span>{currentProduct.desc}</span>
          </List.Item>
          <List.Item>
            <span className={`product-detail-left`}>Price:</span>
            <span>${currentProduct.price}</span>
          </List.Item>
          <List.Item>
            <span className={`product-detail-left`}>Category:</span>
            <span>
              {categoryName} {pCategoryName.length > 0 ? `<= ${pCategoryName}` : null}
            </span>
          </List.Item>
          <List.Item>
            <span className={`product-detail-left`}>Pictures:</span>
            {currentProduct.imgs.map(img => {
              return (
                <img
                  className={`product-img`}
                  key={img}
                  src={`${BASE_IMG_URL}${img}`}
                  alt={currentProduct.name}
                />
              );
            })}
          </List.Item>
          <List.Item>
            <span className={`product-detail-left`}>Detail:</span>
            <span dangerouslySetInnerHTML={{ __html: currentProduct.detail }} />
          </List.Item>
        </List>
      ) : null}
    </Card>
  );
};

export default memo(connect(mapStateToProps)(ProductDetail));
