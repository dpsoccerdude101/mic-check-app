import PagedAndSortedRequest from 'src/types/pagedAndSortedRequest';

type FanSpotlightBandQueryRequest = PagedAndSortedRequest & {
  bandId: string;
  showId?: string;
};

export default FanSpotlightBandQueryRequest;
