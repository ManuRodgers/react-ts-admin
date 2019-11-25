import React from 'react';
import { Form, Select, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';

interface IAddCategoryFormProps extends FormComponentProps {}

const AddCategoryForm: React.FunctionComponent<IAddCategoryFormProps> = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form className={`add-category-form`}>
      <Form.Item>
        {getFieldDecorator('parentId', {
          initialValue: '0',
        })(
          <Select>
            <Select.Option value={'0'}>First level classification list</Select.Option>
            <Select.Option value={'1'}>Computer</Select.Option>
            <Select.Option value={'2'}>Book</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('categoryName', {
          initialValue: '',
        })(<Input placeholder={`Please enter category name`} />)}
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: 'add_category_form' })(AddCategoryForm);
