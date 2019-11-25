import React, { memo, useCallback, useState } from 'react';
import useSWR from 'swr';
import { connect } from 'dva';
import { Button, Card, Icon, Table, Modal } from 'antd';
import { ColumnProps } from 'antd/es/table';
import LinkButton from '@/components/LinkButton/LinkButton';
import './Category.less';
import { ICategory, IGlobalState, IUmiComponent } from '@/interfaces';
import AddCategoryForm from '@/pages/Category/components/AddCategoryForm';
import UpdateCategoryForm from '@/pages/Category/components/UpdateCategoryForm';
import { setCurrentCategory } from '@/actions/categoryActions';

const mapStateToProps = ({ category }: IGlobalState) => ({
  category,
});

type CategoryStateProps = ReturnType<typeof mapStateToProps>;

interface ICategoryProps extends IUmiComponent, CategoryStateProps {}

const Category: React.FunctionComponent<ICategoryProps> = ({ category, dispatch }) => {
  const { categories, subCategories, currentCategory } = category;
  const [parentId, setParentId] = useState<string>('0');
  const [categoryName, setCategoryName] = useState<string>('');
  const [status, setStatus] = useState<number>(0);
  console.log(`categories`, categories);

  const handleAddClicked: React.MouseEventHandler<HTMLElement> = useCallback(() => {
    setStatus(1);
  }, []);

  const onAddCategoryOk = useCallback(() => {
    console.log(`onAddCategoryOk`);
    setStatus(0);
  }, []);
  const onAddCategoryCancel = useCallback(() => {
    setStatus(0);
  }, []);

  const onModifyCategoryOk = useCallback(() => {
    console.log(`onModifyCategoryOk`);
    setStatus(0);
  }, []);
  const onModifyCategoryCancel = useCallback(() => {
    setStatus(0);
  }, []);

  const dataSource: ICategory[] = [
    {
      parentId: '0',
      _id: '1',
      name: 'household appliances',
    },
    {
      parentId: '0',
      _id: '2',
      name: 'computer',
    },
    {
      parentId: '0',
      _id: '3',
      name: 'Book',
    },
    {
      parentId: '0',
      _id: '4',
      name: 'costume',
    },
  ];

  const columns: ColumnProps<ICategory>[] = [
    {
      title: 'classification name',
      dataIndex: 'name',
    },
    {
      width: '40%',
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => (
        <span>
          <LinkButton
            onClick={() => {
              setStatus(2);
              dispatch(setCurrentCategory({ currentCategory: record }));
            }}
          >
            modify classification
          </LinkButton>
          <LinkButton onClick={() => {}}>check subcategory</LinkButton>
        </span>
      ),
    },
  ];

  const extra = (
    <Button onClick={handleAddClicked} type={'primary'}>
      <Icon type={'plus'} />
      <span>add</span>
    </Button>
  );
  return (
    <Card className={`category`} title="First level classification list" extra={extra}>
      <Table<ICategory>
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        rowKey={`_id`}
        bordered={true}
        dataSource={dataSource}
        columns={columns}
      />
      <Modal
        title="Add Category"
        visible={status === 1}
        onOk={onAddCategoryOk}
        onCancel={onAddCategoryCancel}
      >
        <AddCategoryForm />
      </Modal>
      <Modal
        title="Modify Category"
        visible={status === 2}
        onOk={onModifyCategoryOk}
        onCancel={onModifyCategoryCancel}
      >
        <UpdateCategoryForm categoryName={currentCategory.name} />
      </Modal>
    </Card>
  );
};

export default memo(connect(mapStateToProps)(Category));
