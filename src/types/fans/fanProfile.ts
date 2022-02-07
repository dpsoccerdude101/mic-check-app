import FileModel from '../fileModel';

type FanProfile = {
  id: string;
  userName: string;
  email: string;
  name: string;
  surname: string;
  profilePicturePath: string;
  profilePicture: FileModel;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default FanProfile;
