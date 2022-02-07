type BaseDataResponse<T = any> = {
  data?: T;
  message?: string;
  success: boolean;
};

export default BaseDataResponse;
