import React, { memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Card, Cascader, Form, Icon, Input, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { CascaderOptionType } from 'antd/lib/cascader';
import { router } from 'umi';

import { IGlobalState, IProduct, IUmiComponent } from '@/interfaces';
import './ProductAddUpdate.less';
import LinkButton from '@/components/LinkButton/LinkButton';
import { useCategories } from '@/hooks';
import { trigger } from 'swr';
import PicturesWall from '@/pages/ProductAddUpdate/components/PicturesWall';
import FullTextEditor from '@/pages/ProductAddUpdate/components/FullTextEditor';
import { addProductAsync, updateProductAsync } from '@/actions/productActions';
import { ProductStatus } from '@/enums';

const mapStateToProps = ({ product, category }: IGlobalState) => ({
  product,
  category,
});

type ProductAddUpdateStateProps = ReturnType<typeof mapStateToProps>;

interface IProductAddUpdateProps
  extends IUmiComponent,
    ProductAddUpdateStateProps,
    FormComponentProps {}

const ProductAddUpdate: React.FunctionComponent<IProductAddUpdateProps> = ({
  product,
  form,
  dispatch,
  category,
  location,
}) => {
  const { validateFields, getFieldDecorator, resetFields } = form;
  const { categories } = category;
  const [parentId, setParentId] = useState<string>('0');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [imgs, setImgs] = useState<string[]>([]);
  const [detail, setDetail] = useState<string>('');
  const currentProduct = (location.state as IProduct) || {};
  console.log(`currentProduct`, currentProduct);
  // for product category Cascader
  let cascaderOptions: CascaderOptionType[] = [];
  const [options, setOptions] = useState<CascaderOptionType[]>(cascaderOptions);
  useEffect(() => {
    setOptions(
      categories.map(
        category =>
          ({ value: category._id, label: category.name, isLeaf: false } as CascaderOptionType),
      ),
    );
  }, [categories]);
  // get categories form server or cache
  const { data: categoriesData, error } = useCategories(parentId);
  useEffect(() => {
    if (error) {
      message.error(error.message);
    } else if (categoriesData && categoriesData.status === 0) {
      if (parentId === '0') {
        cascaderOptions = categoriesData.data.map(
          category =>
            ({ value: category._id, label: category.name, isLeaf: false } as CascaderOptionType),
        );
        return setOptions(cascaderOptions);
      } else {
        const cascaderOptionChildren = categoriesData.data.map(
          category =>
            ({
              value: category._id,
              label: category.name,
              isLeaf: true,
            } as CascaderOptionType),
        );
        return setOptions(prevOptions => {
          return prevOptions.map(opt => {
            if (opt.value === parentId) {
              return { ...opt, children: cascaderOptionChildren, isLeaf: false };
            } else {
              return { ...opt };
            }
          });
        });
      }
    }
  }, [error, categoriesData, dispatch, parentId]);
  // for categoryIds
  useEffect(() => {
    const { pCategoryId, categoryId } = currentProduct;
    if (pCategoryId && categoryId) {
      if (pCategoryId === '0') {
        setParentId(pCategoryId);
        setCategoryIds([categoryId]);
        trigger(`/api/manage/category/list`);
      } else {
        setParentId(pCategoryId);
        setCategoryIds([pCategoryId, categoryId]);
        trigger(`/api/manage/category/list`);
      }
    }
  }, [currentProduct]);
  // Dynamically load category data
  const loadData = (selectedOptions: CascaderOptionType[] | undefined) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      if (targetOption && targetOption.value) {
        setParentId(targetOption.value);
        trigger(`/api/manage/category/list`);
      }
      targetOption.loading = false;
      setOptions(prevState => {
        return [...prevState];
      });
    }
  };

  const title = (
    <span>
      <LinkButton
        onClick={() => {
          router.push('/admin/product');
        }}
      >
        <Icon type={`arrow-left`} />
      </LinkButton>
      <span>{currentProduct._id ? 'Update Product' : 'App Product'}</span>
    </span>
  );
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log(`imgs`, imgs);
        console.log(`detail`, detail);
        console.log('Received values of form: ', values);
        const { name, desc, price, categoryIds } = values;
        let categoryId, pCategoryId;
        if (categoryIds.length === 1) {
          pCategoryId = '0';
          categoryId = categoryIds[0];
        } else if (categoryIds.length === 2) {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        if (!currentProduct._id) {
          console.log(`add product`);
          dispatch(
            addProductAsync({
              addProductDto: {
                categoryId,
                pCategoryId,
                name,
                desc,
                price,
                imgs,
                detail,
                status: ProductStatus.FOR_SALE,
              },
            }),
          );
        } else {
          console.log(`update product`);
          const { _id } = currentProduct;
          if (imgs.length === 0 && detail.length > 0) {
            return dispatch(
              updateProductAsync({
                updateProductDto: {
                  _id,
                  categoryId,
                  pCategoryId,
                  name,
                  desc,
                  price,
                  detail,
                  status: ProductStatus.FOR_SALE,
                },
              }),
            );
          }
          if (imgs.length > 0 && detail.length === 0) {
            return dispatch(
              updateProductAsync({
                updateProductDto: {
                  _id,
                  categoryId,
                  pCategoryId,
                  name,
                  desc,
                  price,
                  imgs,
                  status: ProductStatus.FOR_SALE,
                },
              }),
            );
          }
          if (imgs.length > 0 && detail.length > 0) {
            return dispatch(
              updateProductAsync({
                updateProductDto: {
                  _id,
                  categoryId,
                  pCategoryId,
                  name,
                  desc,
                  price,
                  imgs,
                  detail,
                  status: ProductStatus.FOR_SALE,
                },
              }),
            );
          }
          if (imgs.length === 0 && detail.length === 0) {
            return dispatch(
              updateProductAsync({
                updateProductDto: {
                  _id,
                  categoryId,
                  pCategoryId,
                  name,
                  desc,
                  price,
                  status: ProductStatus.FOR_SALE,
                },
              }),
            );
          }
        }
        resetFields();
      }
    });
  };
  const checkPrice = (rule: any, value: any, callback: any) => {
    if (value * 1 > 0) {
      callback();
      return;
    }
    callback('Price must greater than zero!');
  };
  const getImgs = (imgs: string[]): void => {
    setImgs(imgs);
  };
  const getDetail = (detail: string): void => {
    setDetail(detail);
  };

  return (
    <Card title={title} className={`product-add-update`}>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} onSubmit={handleSubmit}>
        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please enter product name!' }],
            initialValue: currentProduct.name,
          })(<Input allowClear={true} placeholder={`Please enter product name!`} />)}
        </Form.Item>
        <Form.Item label="Description: ">
          {getFieldDecorator('desc', {
            rules: [{ required: true, message: 'Please enter product description!' }],
            initialValue: currentProduct.desc,
          })(
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              allowClear={true}
              placeholder={`Please enter product description!`}
            />,
          )}
        </Form.Item>
        <Form.Item label="Price">
          {getFieldDecorator('price', {
            rules: [
              { required: true, message: 'Please enter product price!' },
              {
                validator: checkPrice,
              },
            ],
            initialValue: currentProduct.price,
          })(
            <Input
              allowClear={true}
              type={'number'}
              addonBefore="$"
              placeholder={`Please enter product price!`}
            />,
          )}
        </Form.Item>
        <Form.Item label="Category">
          {getFieldDecorator('categoryIds', {
            rules: [{ required: true, message: 'Please select product category!' }],
            initialValue: categoryIds,
          })(<Cascader options={options} loadData={loadData} />)}
        </Form.Item>
        <Form.Item label="pictures">
          <PicturesWall imgNames={currentProduct.imgs} getImgs={getImgs} />
        </Form.Item>
        <Form.Item label="Detail" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          <FullTextEditor getDetail={getDetail} detail={currentProduct.detail} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 5, offset: 1 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default memo(
  Form.create<IProductAddUpdateProps>({ name: 'AddProductForm' })(
    connect(mapStateToProps)(ProductAddUpdate),
  ),
);
