import request from 'umi-request';
import { message } from 'antd';
import { HTTPMethod } from 'http-method-enum';

import { LoginDto } from '@/dto/login.dto';
import { AddUserDto } from '@/dto/add-user.dto';
import { AddCategoryDto } from '@/dto/add-category.dto';
import { UpdateCategoryDto } from '@/dto/update-category.dto';
import { DeleteCategoryDto } from '@/dto/delete-category.dto';

const BASE = '';

// user
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

// category
// export const reqCategories = (getCategoriesDto: GetCategoriesDto) =>
//   request(BASE + '/api/manage/category/list', { method: HTTPMethod.GET, params: getCategoriesDto });

export const addCategory = (addCategoryDto: AddCategoryDto) =>
  request(BASE + '/api/manage/category/add', { method: HTTPMethod.POST, data: addCategoryDto });

export const updateCategory = (updateCategoryDto: UpdateCategoryDto) =>
  request(BASE + '/api/manage/category/update', {
    method: HTTPMethod.PUT,
    data: updateCategoryDto,
  });

export const deleteCategory = (deleteCategoryDto: DeleteCategoryDto) =>
  request(BASE + '/api/manage/category/delete', {
    method: HTTPMethod.DELETE,
    data: deleteCategoryDto,
  });
