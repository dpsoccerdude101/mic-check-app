import { NextPageContext } from 'next';
import queryString from 'query-string';
import nookies from 'nookies';
import { ApiRoutes, AppConstants } from 'src/constants';
import { BaseResponse, ListResponse, Show, ShowsFilter, ShowsQueryRequest } from 'src/types';
import { Api } from 'src/utils';
import { SpotlightsProvider } from 'src/contexts';
import HomePage from 'src/components/bands/home/homePage';
import BandShowsProps from 'src/components/bands/home/bandShowsProps';
import APP_PERMISSIONS from 'src/constants/permissions';

const SHOWS_OFFSET = 5;

const HomeWrapper = ({
  showListResponse, 
  requiredPermissions
}: BandShowsProps) => (
  <SpotlightsProvider>
    <HomePage showListResponse={showListResponse} />
  </SpotlightsProvider>
);

export async function getServerSideProps(context: NextPageContext) {
  // Load band shows on Server Side
  const parsedCookies = nookies.get(context);
  const bandId: string = parsedCookies[AppConstants.bandIdLabel];
  const request: ShowsQueryRequest = {
    bandId,
    filter: ShowsFilter.Upcoming,
    maxResultCount: SHOWS_OFFSET,
    skipCount: 0,
    sorting: null,
  };

  const url = `${ApiRoutes.Shows.FromBandWithQuery}?${queryString.stringify(request)}`;
  const response: BaseResponse<ListResponse<Show>> = await Api.get(url, context);
  const { data, success } = response;
  if (success) {
    return { 
      props: { 
        showListResponse: data,
        requiredPermissions: [
          APP_PERMISSIONS.Shows.List,
        ]
      } 
    };
  }
  return {
    props: {
      showListResponse: {
        totalCount: 0
      },
      requiredPermissions: [
        APP_PERMISSIONS.Shows.List,
      ]
    }
  };
}

export default HomeWrapper;
