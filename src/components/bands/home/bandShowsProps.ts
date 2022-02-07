import { ListResponse, PagePermission, Show } from 'src/types';

type BandShowsProps = {
  showListResponse: ListResponse<Show>
} & PagePermission;
export default BandShowsProps;
