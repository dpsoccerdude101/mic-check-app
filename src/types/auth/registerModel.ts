export type FanRegisterModel = {
  email: string;
};

export type BandRegisterModel = {
  email: string;
  name: string;
};

type RegisterModel = FanRegisterModel | BandRegisterModel;
export default RegisterModel;
