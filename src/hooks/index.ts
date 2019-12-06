import { useEffect, useMemo, useRef } from 'react';
import request, { RequestOptionsInit } from 'umi-request';
import useSWR, { ConfigInterface, keyInterface, responseInterface } from 'swr';
import { ICategory, IProduct } from '@/interfaces';
import { HTTPMethod } from 'http-method-enum';
import { SearchTypes } from '@/enums';
export const usePrevious = <T extends {}>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useRequest = (
  url: keyInterface,
  reqOption: RequestOptionsInit,
  config?: ConfigInterface,
): responseInterface<any, Error> => {
  return useSWR(
    url,
    url => {
      if (typeof url === 'string') {
        return request(url, reqOption);
      }
      if (typeof url === 'function') {
        return request(url(), reqOption);
      }
      if (url === null) {
        return;
      }
    },
    config,
  );
};

export const useCategories = (
  parentId: string,
): responseInterface<{ status: number; data: ICategory[] }, Error> => {
  const params = useMemo(() => ({ parentId }), [parentId]);
  return useRequest(
    [() => `/api/manage/category/list`, params],
    {
      method: HTTPMethod.GET,
      params,
    },
    { revalidateOnFocus: false },
  );
};
export const useCategory = (
  categoryId: string,
): responseInterface<{ status: number; data: ICategory }, Error> => {
  const params = useMemo(() => ({ categoryId }), [categoryId]);
  return useRequest(
    [() => `/api/manage/category/info`, params],
    {
      method: HTTPMethod.GET,
      params,
    },
    { revalidateOnFocus: false },
  );
};
export const useProducts = (
  pageNum: number,
  pageSize: number,
): responseInterface<
  {
    status: number;
    data: { list: IProduct[]; pageNum: number; pageSize: number; pages: number; total: number };
  },
  Error
> => {
  const params = useMemo(() => ({ pageNum, pageSize }), [pageNum, pageSize]);
  return useRequest(
    [() => `/api/manage/product/list`, params],
    {
      method: HTTPMethod.GET,
      params,
    },
    { revalidateOnFocus: false },
  );
};
export const useSearchProducts = (
  pageNum: number,
  pageSize: number,
  searchType: SearchTypes,
  searchText: string,
): responseInterface<
  {
    status: number;
    data: { list: IProduct[]; pageNum: number; pageSize: number; pages: number; total: number };
  },
  Error
> => {
  const params = useMemo(() => ({ pageNum, pageSize, searchType, searchText }), [
    pageNum,
    pageSize,
    searchType,
    searchText,
  ]);
  return useRequest(
    [() => `/api/manage/product/search`, params],
    {
      method: HTTPMethod.GET,
      params,
    },
    { revalidateOnFocus: false },
  );
};
