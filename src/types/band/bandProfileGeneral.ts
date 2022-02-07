import FileModel from '../fileModel';

type BandProfileGeneral = {
  id: string;
  name: string;
  description: string;
  hometown: string;
  profilePicture: FileModel;
  selectedGenreTags: string[]
};

export default BandProfileGeneral;
