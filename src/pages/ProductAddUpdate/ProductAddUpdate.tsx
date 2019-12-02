import React, { memo, useEffect, useMemo, useState } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Form, Cascader, Upload, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { CascaderOptionType } from 'antd/lib/cascader';
import { router } from 'umi';

import { IGlobalState, IProduct, IUmiComponent } from '@/interfaces';
import './ProductAddUpdate.less';
import LinkButton from '@/components/LinkButton/LinkButton';
import { useCategories } from '@/hooks';
import { trigger } from 'swr';
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
  const [parentId, setParentId] = useState<string>('0');
  const currentProduct = (location.state as IProduct) || {};
  console.log(`currentProduct`, currentProduct);
  // for product category Cascader
  let cascaderOptions: CascaderOptionType[] = [];
  const [options, setOptions] = useState<CascaderOptionType[]>(cascaderOptions);
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
        console.log(`parentId`, parentId);
        console.log(`categoriesData.data`, categoriesData.data);
        const cascaderOptionChildren = categoriesData.data.map(
          category =>
            ({ value: category._id, label: category.name, isLeaf: true } as CascaderOptionType),
        );
        // TODO
        return setOptions(prevOptions => {
          console.log(`prevOptions`, prevOptions);
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
  console.log(`options`, options);
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
        resetFields();
        console.log('Received values of form: ', values);
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
  let categoryIds = [] as string[];
  useEffect(() => {
    const { pCategoryId, categoryId } = currentProduct;
    console.log(`pCategoryId`, pCategoryId);
    if (pCategoryId && categoryId) {
      if (pCategoryId === '0') {
        setParentId(pCategoryId);
        categoryIds.push(categoryId);
        trigger(`/api/manage/category/list`);
      } else {
        setParentId(pCategoryId);
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
        trigger(`/api/manage/category/list`);
      }
    }
  }, [currentProduct, categoryIds]);

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
