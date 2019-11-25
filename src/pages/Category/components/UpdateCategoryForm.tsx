import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';

interface IUpdateCategoryFormProps extends FormComponentProps {
  categoryName: string;
}

const UpdateCategoryForm: React.FunctionComponent<IUpdateCategoryFormProps> = ({
  form,
  categoryName,
}) => {
  const { getFieldDecorator } = form;
  return (
    <Form className={`update-category-form`}>
      <Form.Item>
        {getFieldDecorator('categoryName', {
          initialValue: categoryName,
        })(<Input placeholder={`Please enter category name`} />)}
      </Form.Item>
    </Form>
  );
};

export default Form.create<IUpdateCategoryFormProps>({ name: 'update_category_form' })(
  UpdateCategoryForm,
);
