import type BaseUser from './baseUser';
import UserTypeEnum from './loggedUserTypeEnum';
import Permission from './permission';

interface LoggedUser extends BaseUser {
  bandId?: string;
  fanId?: string;
  isAdmin: boolean;
  isBandMember: boolean;
  isFan: boolean;
  permissions?: Permission[];
}

export const createUser: Function = (user: LoggedUser, bandOrFanId: string, type: UserTypeEnum): LoggedUser => ({
  bandId: type === UserTypeEnum.Admin || type === UserTypeEnum.BandMember ? bandOrFanId : null,
  fanId: type === UserTypeEnum.Fan ? bandOrFanId : null,
  isAdmin: type === UserTypeEnum.Admin,
  isBandMember: type === UserTypeEnum.BandMember ? true : type === UserTypeEnum.Admin ? (!(!bandOrFanId || bandOrFanId === '')) : false,
  isFan: type === UserTypeEnum.Fan,
  email: user.email,
  name: user.name,
  id: user.id,
  type,
  permissions: user.permissions
});

export default LoggedUser;
