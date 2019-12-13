import * as React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { useEffect } from 'react';

interface IAddRoleFormProps extends FormComponentProps {
  getAddRoleForm: (form: any) => void;
}

const AddRoleForm: React.FunctionComponent<IAddRoleFormProps> = ({ form, getAddRoleForm }) => {
  const { getFieldDecorator } = form;

  useEffect(() => {
    getAddRoleForm(form);
  }, []);
  return (
    <Form className={`add-role-form`}>
      <Form.Item label={`Role Name:`}>
        {getFieldDecorator('roleName', {
          initialValue: '',
          rules: [
            {
              required: true,
              message: 'Role name is required',
            },
          ],
        })(<Input placeholder={`Please enter role name`} />)}
      </Form.Item>
    </Form>
  );
};

export default Form.create<IAddRoleFormProps>({ name: 'add_role_form' })(AddRoleForm);
