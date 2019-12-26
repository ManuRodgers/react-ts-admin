import * as React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { useEffect } from 'react';
import { IRole, IUser } from '@/interfaces';

const Option = Select.Option;

interface IUserFormProps extends FormComponentProps {
  getUserForm: (form: any) => void;
  roles: IRole[];
  currentUser: IUser;
}

const UserForm: React.FunctionComponent<IUserFormProps> = ({
  form,
  getUserForm,
  roles,
  currentUser,
}) => {
  const { getFieldDecorator, resetFields } = form;

  useEffect(() => {
    getUserForm(form);
  }, []);

  return (
    <Form
      className={`user-form`}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout={'horizontal'}
    >
      <Form.Item label={`username:`}>
        {getFieldDecorator('username', {
          initialValue: currentUser._id ? currentUser.username : '',
          rules: [
            {
              required: true,
              message: 'username is required',
            },
          ],
        })(<Input placeholder={`Please enter username`} />)}
      </Form.Item>
      {currentUser._id ? null : (
        <Form.Item label={`password:`}>
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: 'password is required',
              },
            ],
          })(<Input type={`password`} placeholder={`Please enter password`} />)}
        </Form.Item>
      )}

      <Form.Item label={`phone:`}>
        {getFieldDecorator('phone', {
          initialValue: currentUser._id ? currentUser.phone : '',
          rules: [
            {
              required: true,
              message: 'phone is required',
            },
          ],
        })(<Input placeholder={`Please enter phone`} />)}
      </Form.Item>
      <Form.Item label={`email:`}>
        {getFieldDecorator('email', {
          initialValue: currentUser._id ? currentUser.email : '',
          rules: [
            {
              required: true,
              message: 'email is required',
            },
          ],
        })(<Input placeholder={`Please enter email`} />)}
      </Form.Item>
      <Form.Item label={`role:`}>
        {getFieldDecorator('role_id', {
          initialValue: currentUser._id ? currentUser.role_id : '',
          rules: [
            {
              required: true,
              message: 'role is required',
            },
          ],
        })(
          <Select placeholder={`Please select role`}>
            {roles.map(role => {
              return (
                <Option key={role._id} value={role._id}>
                  {role.name}
                </Option>
              );
            })}
          </Select>,
        )}
      </Form.Item>
    </Form>
  );
};

export default Form.create<IUserFormProps>({ name: 'user_form' })(UserForm);
