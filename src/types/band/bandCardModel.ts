import Show from '../shows/show';

type BandCardModel = {
  id: string;
  name: string;
  genreTags: string[];
  upcomingShows: number;
  likesCount: number;
  profilePictureId: string;
  nextShow: Show;
  likedBand: boolean;
};

export default BandCardModel;
