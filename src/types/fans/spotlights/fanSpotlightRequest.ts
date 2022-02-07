import FileModel from '../../fileModel';

type FanSpotlightRequest = {
  fanId: string;
  bandId: string;
  mediaFile: FileModel;
  showId?: string;
};

export default FanSpotlightRequest;
