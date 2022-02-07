import Cookies from 'js-cookie';
import nookies from 'nookies';
import { NextPageContext } from 'next';
import type { BaseResponse } from '../types';
import AppConstants from '../constants/appConstants';

const httpStatusCodes = {
  SUCCESS: 200,
  NO_CONTENT: 204,
  UNAUTHORIZED: 403
};

// Context is used for server-side render requests
interface API {
  delete: (route: string) => Promise<BaseResponse>;
  get: (route: string, context?: NextPageContext) => Promise<BaseResponse>;
  put: (route: string, obj: any) => Promise<BaseResponse>;
  post: (route: string, obj: any, context?: NextPageContext) => Promise<BaseResponse>;
}

const baseApiRoute = process.env.NEXT_PUBLIC_BASE_API_ROUTE;

const safeRun = async (func: Function): Promise<any> => {
  try {
    const res = await func();
    return res;
  } catch (err) {
    const response: BaseResponse = { message: 'Something went wrong!', success: false };
    return response;
  }
};

const validateResponse = async (res: Response): Promise<BaseResponse<any>> => {
  let baseResponse: BaseResponse = { success: true };

  if (res.status === httpStatusCodes.SUCCESS) {
    const response: any = await res.json();
    if ((response as BaseResponse).message || (response as BaseResponse).success) {
      return response as BaseResponse;
    }
    baseResponse.data = response;
    return baseResponse;
  }

  if (res.status === httpStatusCodes.NO_CONTENT) { return baseResponse; }
  if (res.status === httpStatusCodes.UNAUTHORIZED) {
    baseResponse.success = false;
    baseResponse.message = 'You are not authorized to do this.';
    return baseResponse;
  }

  const objResponse = await res.json();
  let message = 'Something went wrong!';
  // try read message error
  if (objResponse) {
    if (objResponse.message) {
      message = objResponse.message;
    } else if (objResponse.error && objResponse.error.message) {
      const obj = objResponse.error;
      if (obj.message === 'ValidationErrorMessage' && obj.validationErrors && obj.validationErrors.length > 0) {
        message = obj.validationErrors[0].message;
      } else {
        message = obj.message;
      }
    }
  }
  baseResponse = { success: false, message };
  return baseResponse;
};

const defaultHeaders = (token: string | null): HeadersInit => {
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  }

  return {
    'Content-Type': 'application/json'
  };
};

const baseHeaders = (): HeadersInit => {
  const userToken = Cookies.get(AppConstants.tokenLabel);
  return defaultHeaders(userToken);
};

const getHeadersFromContext = (context: NextPageContext): HeadersInit => {
  const parsedCookies = nookies.get(context);
  const token = parsedCookies[AppConstants.tokenLabel];
  return defaultHeaders(token);
};

const execute = async (route: string, obj: any, method: string, context?: NextPageContext) => {
  const apiRoute = baseApiRoute + route;
  const jsonObj = obj ? JSON.stringify(obj) : null;
  const response = await safeRun(async () => {
    const res = await fetch(apiRoute, {
      body: jsonObj,
      headers: context ? getHeadersFromContext(context) : baseHeaders(),
      method
    });
    const baseResponse = await validateResponse(res);
    return baseResponse;
  });
  return response;
};

const api: API = {
  delete: async (route) => {
    const response = await execute(route, null, 'DELETE');
    return response;
  },
  get: async (route: string, context) => safeRun(async () => {
    const apiRoute = route.startsWith('http') ? route : baseApiRoute + route;
    let requestHeaders: HeadersInit;
    if (!context) { requestHeaders = baseHeaders(); } else { requestHeaders = getHeadersFromContext(context); }

    const res = await fetch(apiRoute, { headers: requestHeaders });
    const validatedResponse = await validateResponse(res);
    return validatedResponse;
  }),
  post: async (route, obj, context) => {
    const response = await execute(route, obj, 'POST', context);
    return response;
  },
  put: async (route, obj) => {
    const response = await execute(route, obj, 'PUT');
    return response;
  }
};

export default api;
