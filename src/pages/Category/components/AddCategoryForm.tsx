import React, { useEffect } from 'react';
import { Form, Select, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ICategory } from '@/interfaces';

interface IAddCategoryFormProps extends FormComponentProps {
  categories: ICategory[];
  currentCategory: ICategory;
  parentId: string;
  getAddForm: (form: any) => void;
}

const AddCategoryForm: React.FunctionComponent<IAddCategoryFormProps> = ({
  form,
  categories,
  parentId,
  getAddForm,
  currentCategory,
}) => {
  const { getFieldDecorator } = form;
  const { _id } = currentCategory;
  useEffect(() => {
    getAddForm(form);
  }, []);
  return (
    <Form className={`add-category-form`}>
      <Form.Item>
        {getFieldDecorator('parentId', {
          initialValue: parentId,
        })(
          <Select defaultActiveFirstOption={true}>
            <Select.Option value={'0'}>First level classification list</Select.Option>
            {categories.map(category => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('categoryName', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'categoryName is required',
            },
          ],
        })(<Input placeholder={`Please enter category name`} />)}
      </Form.Item>
    </Form>
  );
};

export default Form.create<IAddCategoryFormProps>({ name: 'add_category_form' })(AddCategoryForm);
