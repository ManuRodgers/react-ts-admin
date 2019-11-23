import { HTTPMethod } from 'http-method-enum';
import request, { RequestResponse, RequestOptionsWithResponse } from 'umi-request';

export default function ajax(
  url: string,
  option: RequestOptionsWithResponse = { getResponse: true, method: HTTPMethod.GET },
): Promise<RequestResponse> | undefined {
  if (option.method === HTTPMethod.GET) {
    return request(url, option);
  } else if (option.method === HTTPMethod.POST) {
    return request(url, option);
  }
}
