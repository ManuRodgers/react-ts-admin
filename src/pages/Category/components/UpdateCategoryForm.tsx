import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ICategory } from '@/interfaces';

interface IUpdateCategoryFormProps extends FormComponentProps {
  currentCategory: ICategory;
  getUpdateForm: (form: any) => void;
}

const UpdateCategoryForm: React.FunctionComponent<IUpdateCategoryFormProps> = ({
  form,
  currentCategory,
  getUpdateForm,
}) => {
  const { getFieldDecorator } = form;
  useEffect(() => {
    getUpdateForm(form);
  }, []);
  const { name } = currentCategory;
  return (
    <Form className={`update-category-form`}>
      <Form.Item>
        {getFieldDecorator('categoryName', {
          initialValue: name,
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

export default Form.create<IUpdateCategoryFormProps>({ name: 'update_category_form' })(
  UpdateCategoryForm,
);
