import React, { memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Table, Select, Input, Button, Icon, message } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { IGlobalState, IProduct, IUmiComponent } from '@/interfaces';
import './ProductHome.less';
import LinkButton from '@/components/LinkButton/LinkButton';
import { useProducts } from '@/hooks';
import { PAGE_SIZE } from '@/utils/constant';
import { router } from 'umi';
const mapStateToProps = ({ product }: IGlobalState) => ({
  product,
});

type ProductHomeStateProps = ReturnType<typeof mapStateToProps>;

interface IProductHomeProps extends IUmiComponent, ProductHomeStateProps {}

const ProductHome: React.FunctionComponent<IProductHomeProps> = ({
  product,
  dispatch,
  history,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const { products } = product;

  // get products from server or cache
  const { data: productsData, isValidating: loading, error } = useProducts(pageNum, PAGE_SIZE);
  useEffect(() => {
    if (error) {
      setIsLoading(loading);
      message.error(error.message);
    } else if (productsData && productsData.status === 0) {
      setIsLoading(loading);
      console.log(`productsData`, productsData.data);
      const { total, list } = productsData.data;
      setTotal(total);
    }
  }, [error, productsData, loading]);

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
      <Select value={'name'}>
        <Select.Option value={'name'}>search by name</Select.Option>
        <Select.Option value={`desc`}>search by description</Select.Option>
      </Select>
      <Input style={{ width: 150, margin: '0 15px' }} placeholder={`keyword`} />
      <Button type={'primary'}>Search</Button>
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

export default memo(connect(mapStateToProps)(ProductHome));
