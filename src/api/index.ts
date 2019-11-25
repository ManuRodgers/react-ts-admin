import request from 'umi-request';
import { message } from 'antd';
import { HTTPMethod } from 'http-method-enum';

import { LoginDto } from '@/dto/login.dto';
import { AddUserDto } from '@/dto/add-user.dto';
import { GetCategoriesDto } from '@/dto/get-categories.dto';
import { AddCategoryDto } from '@/dto/add-category.dto';
import { UpdateCategoryDto } from '@/dto/update-category.dto';

const BASE = '';

export const reqLogin = (loginDto: LoginDto) => {
  // ajax('/login', { method: HTTPMethod.POST, data: loginDto, getResponse: true });
  return request(BASE + `/api/login`, {
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
  request(BASE + '/api/manage/user/add', { method: HTTPMethod.POST, data: user });

export const reqCategories = (getCategoriesDto: GetCategoriesDto) =>
  request(BASE + '/api/manage/category/list', { method: HTTPMethod.GET, params: getCategoriesDto });

export const addCategory = (addCategoryDto: AddCategoryDto) =>
  request(BASE + '/api/manage/category/add', { method: HTTPMethod.POST, data: addCategoryDto });

export const updateCategory = (updateCategoryDto: UpdateCategoryDto) =>
  request(BASE + '/api/manage/category/update', { method: HTTPMethod.POST, data: updateCategoryDto });
