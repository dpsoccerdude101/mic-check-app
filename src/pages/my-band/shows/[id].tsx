import { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import queryString from 'query-string';
import { useSnackbar } from 'notistack';
import {
  CustomLoader,
  PageWrapper,
  ShowList,
  ShowsSortBy,
  ShowsSortBySelector,
  ShowsToggle,
} from 'src/components';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { layoutContainerId } from 'src/constants/appConstants';
import { Api } from 'src/utils';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { ListResponse, PagePermission, ShowsFilter, ShowsQueryRequest } from 'src/types';
import type { Band, BaseResponse, Show } from 'src/types';
import APP_PERMISSIONS from 'src/constants/permissions';

interface ShowProps extends PagePermission {
  band: Band;
  listResponse: ListResponse<Show>;
}

const SHOWS_BUFFER = 10;

const Shows = ({ 
  band, 
  listResponse, 
  requiredPermissions = [
    APP_PERMISSIONS.Shows.View,
    APP_PERMISSIONS.Bands.Shows.View,
  ]
}: ShowProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = useState(ShowsFilter.Upcoming);
  const [sortBy, setSortBy] = useState(ShowsSortBy.Date);
  const [shows, setShows] = useState<Show[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  let title = 'Shows';
  if (band != null) {
    title += ` - ${band.name}`;
  }

  const loadShows = async (maxResultCount: number) => {
    setLoading(true);
    const sorting = filter === ShowsFilter.Past && sortBy === ShowsSortBy.Date
      ? ShowsSortBy.DateDesc
      : sortBy;
    const request: ShowsQueryRequest = {
      bandId: band.id,
      filter,
      maxResultCount,
      skipCount: 0,
      sorting,
    };

    const url = `${ApiRoutes.Shows.FromBandWithQuery}?${queryString.stringify(request)}`;
    const response: BaseResponse<ListResponse<Show>> = await Api.get(url);
    const { data, success } = response;
    if (success) {
      setShows(data.items);
      setTotalCount(data.totalCount);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const element = document.getElementById('hiddenButton');
    if (!element) return;
    const position = element.getBoundingClientRect();
    const isAtBottom = position.top < window.innerHeight + 1 && position.bottom >= 0;
    if (isAtBottom && !loading) {
      loadShows(shows.length + SHOWS_BUFFER);
    }
  };

  useEffect(() => {
    document
      .getElementById(layoutContainerId)
      ?.addEventListener('scroll', handleScroll);
    return () => {
      document
        .getElementById(layoutContainerId)
        ?.removeEventListener('scroll', handleScroll);
    };
  }, [shows, loading]);

  useEffect(() => {
    if (band == null || listResponse == null) {
      enqueueSnackbar('Something is wrong with your connection', {
        variant: 'error',
      });
    } else {
      setShows(listResponse.items);
      setTotalCount(listResponse.totalCount);
    }
  }, [band]);

  useEffect(() => {
    loadShows(SHOWS_BUFFER);
  }, [filter, sortBy]);

  const renderHeader = () => (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={6} md={4}>
        <Typography variant='h1'>Shows</Typography>
      </Grid>
      <Grid sx={{ display: { xs: 'none', lg: 'block' } }} item lg={2} />
      <Grid item xs={6} md={4} lg={3}>
        <Link href={UiRoutes.MyBand.Shows.New}>
          <Button
            style={{ padding: '13px 14px' }}
            size='large'
            variant='contained'
            fullWidth
          >
            Add Show
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <ShowsSortBySelector
          value={sortBy}
          handleChange={(newValue) => setSortBy(newValue)}
        />
      </Grid>
    </Grid>
  );

  const renderNextShowsButtonWhenNeeded = () => {
    if (shows.length === totalCount) {
      return <div />;
    }
    return (
      <div style={{ textAlign: 'center' }}>
        {loading && <CustomLoader paddingTop='10px' />}

        <div id='hiddenButton' />
        {/* <LoadMoreButton text='View More Shows' handleClick={async () => { loadShows(shows.length + SHOWS_BUFFER); }} /> */}
      </div>
    );
  };

  const renderShowItems = () => <ShowList filter={filter} items={shows} />;

  const renderToggleUpcomingPast = () => (
    <div style={{ paddingTop: 20, paddingBottom: 20 }}>
      <ShowsToggle
        value={filter}
        handleChange={(value: ShowsFilter) => setFilter(value)}
      />
    </div>
  );

  return (
    <PageWrapper title={title}>
      {renderHeader()}
      {renderToggleUpcomingPast()}
      {renderShowItems()}
      {renderNextShowsButtonWhenNeeded()}
    </PageWrapper>
  );
};

Shows.propTypes = {
  band: PropTypes.any,
  listResponse: PropTypes.any,
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const bandResponse: BaseResponse<Band> = await Api.get(
    ApiRoutes.Bands.Get(id)
  );
  const request: ShowsQueryRequest = {
    bandId: id,
    filter: ShowsFilter.Upcoming,
    maxResultCount: 5,
    skipCount: 0,
    sorting: null,
  };
  const url = `${ApiRoutes.Shows.FromBandWithQuery}?${queryString.stringify(
    request
  )}`;
  const showsResponse: BaseResponse<ListResponse<Show>> = await Api.get(
    url,
    context
  );

  let band: Band = null;
  let listResponse: ListResponse<Show> = null;

  if (bandResponse.success) {
    band = bandResponse.data as Band;
  }

  if (showsResponse.success) {
    listResponse = showsResponse.data;
  }

  return {
    props: {
      band,
      listResponse,
      requiredPermissions: [
        APP_PERMISSIONS.Shows.View,
        APP_PERMISSIONS.Bands.Shows.View,
      ]
    },
  };
}

export default Shows;
