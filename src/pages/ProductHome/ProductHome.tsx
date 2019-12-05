import React, { memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Table, Select, Input, Button, Icon, message, Form } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import { IGlobalState, IProduct, IUmiComponent } from '@/interfaces';
import './ProductHome.less';
import LinkButton from '@/components/LinkButton/LinkButton';
import { useCategories, useProducts, useSearchProducts } from '@/hooks';
import { PAGE_SIZE } from '@/utils/constant';
import { router } from 'umi';
import { setCategories } from '@/actions/categoryActions';
import { setProducts } from '@/actions/productActions';
import { SearchTypes } from '@/enums';
const mapStateToProps = ({ product }: IGlobalState) => ({
  product,
});

type ProductHomeStateProps = ReturnType<typeof mapStateToProps>;

interface IProductHomeProps extends IUmiComponent, ProductHomeStateProps, FormComponentProps {}

const ProductHome: React.FunctionComponent<IProductHomeProps> = ({
  product,
  dispatch,
  history,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchTypes>(SearchTypes.PRODUCT_NAME);
  console.log(`searchText`, searchText);
  console.log(`searchType`, searchType);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const { products } = product;

  // get top categories from server or cache
  const { data: categoriesData, error: categoryError } = useCategories('0');
  useEffect(() => {
    if (categoryError) {
      message.error(categoryError.message);
    } else if (categoriesData && categoriesData.status === 0) {
      dispatch(setCategories({ categories: categoriesData.data }));
    }
  }, [categoryError, categoriesData, dispatch]);

  // get products from server or cache
  const { data: productsData, isValidating: loading, error: productsError } = useProducts(
    pageNum,
    PAGE_SIZE,
  );
  useEffect(() => {
    if (productsError) {
      setIsLoading(loading);
      message.error(productsError.message);
    } else if (productsData && productsData.status === 0) {
      setIsLoading(loading);
      console.log(`productsData`, productsData.data);
      const { total, list: products, pageNum } = productsData.data;
      dispatch(setProducts({ products }));
      setTotal(total);
      setPageNum(pageNum);
    }
  }, [productsError, productsData, loading, dispatch]);

  // get search products from server or cache
  const { data: searchProductsData, error: searchProductsError } = useSearchProducts(
    pageNum,
    PAGE_SIZE,
    searchType,
    searchText,
  );
  useEffect(() => {
    if (searchProductsError) {
      message.error(searchProductsError.message);
    } else if (searchProductsData && searchProductsData.status === 0) {
      console.log(`searchProductSData`, searchProductsData.data);
      const { total, list: products, pageNum } = searchProductsData.data;
      dispatch(setProducts({ products }));
      setTotal(total);
      setPageNum(pageNum);
    }
  }, [dispatch, searchProductsData, searchProductsError]);

  const columns: ColumnProps<IProduct>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: price => `$${price}`,
    },
    {
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      render: status => {
        return (
          <span>
            <Button type={'primary'}>Sold Out</Button>
            <span>For Sale</span>
          </span>
        );
      },
    },
    {
      title: 'Operation',
      width: 100,
      render: (text, record) => {
        return (
          <span>
            <LinkButton
              onClick={() => {
                console.log(`Detail clicked`);
              }}
            >
              Detail
            </LinkButton>
            <LinkButton
              onClick={() => {
                history.push('/admin/product/addupdate', record);
              }}
            >
              Update
            </LinkButton>
          </span>
        );
      },
    },
  ];

  const title = (
    <span>
      <Form layout={'inline'}>
        <Form.Item>
          <Select
            value={searchType}
            onChange={(value: SearchTypes) => {
              setSearchType(value);
            }}
          >
            <Select.Option value={SearchTypes.PRODUCT_NAME}>search by name</Select.Option>
            <Select.Option value={SearchTypes.PRODUCT_DESC}>search by description</Select.Option>
          </Select>
          ,
        </Form.Item>
        <Form.Item>
          <Input
            value={searchText}
            onChange={event => {
              setSearchText(event.target.value);
            }}
            style={{ width: 150, margin: '0 15px' }}
            placeholder={`search text`}
          />
        </Form.Item>
        {/*<Form.Item>*/}
        {/*  <Button type="primary" htmlType="submit">*/}
        {/*    Search*/}
        {/*  </Button>*/}
        {/*</Form.Item>*/}
      </Form>
    </span>
  );
  const extra = (
    <Button
      type={'primary'}
      onClick={() => {
        router.push(`/admin/product/addupdate`);
      }}
    >
      <Icon type={'plus'} />
      <span>Add Product</span>
    </Button>
  );
  return (
    <Card title={title} className={`product-home`} extra={extra}>
      <Table<IProduct>
        loading={isLoading}
        bordered={true}
        rowKey={'_id'}
        dataSource={products}
        columns={columns}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          total,
          onChange: pageNum => {
            setPageNum(pageNum);
          },
        }}
      />
    </Card>
  );
};

export default memo(
  Form.create<IProductHomeProps>({ name: 'SearchForm' })(connect(mapStateToProps)(ProductHome)),
);
