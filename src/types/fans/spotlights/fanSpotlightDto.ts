import Band from 'src/types/band/band';
import Show from '../../shows/show';

type FanSpotlightDto = {
  id: string;
  band: Band;
  creationTime: Date;
  creatorUsername?: string;
  creatorProfilePicturePath?: string;
  filePath: string;
  showId?: string;
  show?: Show;
  title: string;
  likesCount: number;
  viewsCount: number;
};

export default FanSpotlightDto;
