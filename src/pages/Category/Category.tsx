import React, { memo, useCallback, useState, useEffect } from 'react';
import { connect } from 'dva';
import { mutate, trigger } from 'swr';
import { Button, Card, Icon, Table, Modal, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import LinkButton from '@/components/LinkButton/LinkButton';
import './Category.less';
import { ICategory, IGlobalState, IUmiComponent } from '@/interfaces';
import {
  addCategoryAsync,
  deleteCategoryAsync,
  setCategories,
  setCurrentCategory,
  setParentId,
  setSubCategories,
  updateCategoryAsync,
  updateCategorySync,
} from '@/actions/categoryActions';
import AddCategoryForm from '@/pages/Category/components/AddCategoryForm';
import UpdateCategoryForm from '@/pages/Category/components/UpdateCategoryForm';
import { useCategories } from '@/hooks';
import { UpdateCategoryDto } from '@/dto/update-category.dto';
import { AddCategoryDto } from '@/dto/add-category.dto';

const mapStateToProps = ({ category }: IGlobalState) => ({
  category,
});

type CategoryStateProps = ReturnType<typeof mapStateToProps>;

interface ICategoryProps extends IUmiComponent, CategoryStateProps {}

const Category: React.FunctionComponent<ICategoryProps> = ({ category, dispatch }) => {
  const { categories, subCategories, currentCategory, parentId } = category;
  console.log(`currentCategory`, currentCategory);
  console.log(`subCategories`, subCategories);
  console.log(`categories`, categories);
  console.log(`parentId`, parentId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addForm, setAddForm] = useState();
  const [updateForm, setUpdateForm] = useState();
  const [status, setStatus] = useState<number>(0);

  // get categories from server or cache
  const { data: categoriesData, error, isValidating: loading } = useCategories(parentId);
  useEffect(() => {
    if (error) {
      setIsLoading(loading);
      message.error(error.message);
    } else if (categoriesData && categoriesData.status === 0) {
      setIsLoading(loading);
      if (parentId === '0') {
        dispatch(setCategories({ categories: categoriesData.data }));
        dispatch(setSubCategories({ subCategories: [] }));
      } else {
        dispatch(setSubCategories({ subCategories: categoriesData.data }));
        dispatch(setCategories({ categories: [] }));
      }
    }
  }, [error, categoriesData, loading, parentId, dispatch]);

  // add category
  const handleAddClicked: React.MouseEventHandler<HTMLElement> = useCallback(() => {
    setStatus(1);
  }, []);
  const onAddCategoryOk = useCallback(() => {
    const { resetFields, validateFields } = addForm;
    validateFields((error: any, values: any) => {
      console.error();
      if (!error) {
        const addCategoryDto: AddCategoryDto = values;
        dispatch(addCategoryAsync({ addCategoryDto }));
        resetFields();
        setStatus(0);
      }
    });
  }, [addForm, dispatch]);
  const onAddCategoryCancel = useCallback(() => {
    addForm.resetFields();
    setStatus(0);
  }, [addForm]);

  // Update category
  const onUpdateCategoryOk = useCallback(() => {
    console.log(`currentCategory`, currentCategory);
    const { resetFields, validateFields } = updateForm;
    validateFields((error: any, values: any) => {
      if (!error) {
        const { categoryName } = values;
        const updateCategoryDto: UpdateCategoryDto = {
          categoryName,
          categoryId: currentCategory._id,
        };
        dispatch(updateCategoryAsync({ updateCategoryDto }));
        // it is like updateCategorySync
        dispatch(updateCategorySync({ updateCategoryDto, parentId: currentCategory.parentId }));
        resetFields();
        setStatus(0);
      }
    });
  }, [updateForm, dispatch, currentCategory]);

  const onUpdateCategoryCancel = useCallback(() => {
    updateForm.resetFields();
    setStatus(0);
  }, [updateForm]);

  const handleDeleteClick = useCallback(
    (record: ICategory): void => {
      const { name, _id } = record;
      Modal.confirm({
        title: `Are you sure delete this category ${name}?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          console.log('OK');
          dispatch(deleteCategoryAsync({ deleteCategoryDto: { categoryId: _id } }));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      console.log(`deleted clicked`);
    },
    [dispatch],
  );

  const handleCheckSubcategoryClick = useCallback(
    (record: ICategory) => {
      dispatch(setParentId({ parentId: record._id }));
    },
    [dispatch],
  );

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
            update
          </LinkButton>
          <LinkButton
            onClick={() => {
              handleDeleteClick(record);
            }}
          >
            delete
          </LinkButton>
          {parentId === '0' && (
            <LinkButton
              onClick={() => {
                dispatch(setCurrentCategory({ currentCategory: record }));
                handleCheckSubcategoryClick(record);
              }}
            >
              check subcategory
            </LinkButton>
          )}
        </span>
      ),
    },
  ];

  const handleFirstLevelClassificationListClicked: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    dispatch(setParentId({ parentId: '0' }));
    dispatch(
      setCurrentCategory({
        currentCategory: {
          parentId: '0',
          _id: '0',
          name: '',
        },
      }),
    );
    trigger(`/api/manage/category/list`);
  }, [dispatch]);
  return (
    <Card
      className={`category`}
      title={
        parentId === '0' ? (
          'First level classification list'
        ) : (
          <div>
            <LinkButton onClick={handleFirstLevelClassificationListClicked}>
              First level classification list
            </LinkButton>
            <span>
              <Icon type={`arrow-right`} /> {currentCategory.name}
            </span>
          </div>
        )
      }
      extra={
        parentId === '0' ? (
          <Button onClick={handleAddClicked} type={'primary'}>
            <Icon type={'plus'} />
            <span>add</span>
          </Button>
        ) : null
      }
    >
      <Table<ICategory>
        loading={isLoading}
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        rowKey={`_id`}
        bordered={true}
        dataSource={parentId === '0' ? categories : subCategories}
        columns={columns}
      />
      <Modal
        title="Add Category"
        visible={status === 1}
        onOk={onAddCategoryOk}
        onCancel={onAddCategoryCancel}
      >
        <AddCategoryForm
          currentCategory={currentCategory}
          categories={categories}
          parentId={parentId}
          getAddForm={(form: any) => {
            setAddForm(form);
          }}
        />
      </Modal>
      <Modal
        title="Update Category"
        visible={status === 2}
        onOk={onUpdateCategoryOk}
        onCancel={onUpdateCategoryCancel}
      >
        <UpdateCategoryForm
          getUpdateForm={(form: any) => {
            setUpdateForm(form);
          }}
          currentCategory={currentCategory}
        />
      </Modal>
    </Card>
  );
};

export default memo(connect(mapStateToProps)(Category));
