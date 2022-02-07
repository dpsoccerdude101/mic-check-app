import BaseResponse from './baseResponse';

export default interface LoginReponse extends BaseResponse {
  token: string;
}
