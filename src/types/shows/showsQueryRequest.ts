import { ShowsSortBy } from 'src/components';
import PagedAndSortedRequest from '../pagedAndSortedRequest';
import ShowsFilter from './showsFilter';

type BaseShowsQueryRequest = {
  bandId: string;
  filter: ShowsFilter;
  startDate?: Date;
  endDate?: Date
  sorting?: ShowsSortBy
};

type ShowsQueryRequest = PagedAndSortedRequest & BaseShowsQueryRequest;

export default ShowsQueryRequest;
