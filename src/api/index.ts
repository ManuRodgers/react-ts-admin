import request from 'umi-request';
import { message } from 'antd';
import { HTTPMethod } from 'http-method-enum';

import { LoginDto } from '@/dto/login.dto';
import { AddUserDto } from '@/dto/add-user.dto';

export const reqLogin = (loginDto: LoginDto) => {
  // ajax('/login', { method: HTTPMethod.POST, data: loginDto, getResponse: true });
  return request(`/api/login`, {
    method: HTTPMethod.POST,
    data: loginDto,
    errorHandler: error => {
      console.log(`reqLogin not ok`);
      const { url, statusText } = error.response;
      message.error(`The URL: ${url} is ${statusText}`, 2);
    },
  });
};

export const reqAddUser = (user: AddUserDto) =>
  request('/api/manage/user/add', { method: HTTPMethod.POST, data: user });
