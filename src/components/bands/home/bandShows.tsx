import { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { ApiRoutes } from 'src/constants';
import { CustomLoader, LoadMoreButton, ShowList, ShowsSortBy, ShowsSortBySelector } from 'src/components';
import { BaseResponse, ListResponse, Show, ShowsFilter, ShowsQueryRequest } from 'src/types';
import { useSnackbar } from 'notistack';
import { useAuth } from 'src/hooks';
import { Api } from 'src/utils';

const useStyles = makeStyles({
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fanSpotlightsTitleRow: {
    paddingTop: 15
  }
});

type BandShowsProps = {
  showListResponse: ListResponse<Show>
};

const SHOWS_OFFSET = 5;

const BandShows = (props: BandShowsProps) => {
  const { showListResponse } = props;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Show[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<ShowsSortBy>(ShowsSortBy.CreationTime);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user } = useAuth();

  const reloadShows = async (maxCount: number) => {
    setLoading(true);
    const { bandId } = user as any;
    const request: ShowsQueryRequest = {
      bandId,
      filter: ShowsFilter.Upcoming,
      maxResultCount: maxCount > 0 ? maxCount : SHOWS_OFFSET,
      skipCount: 0,
      sorting: sortBy,
    };
    const url = `${ApiRoutes.Shows.FromBandWithQuery}?${queryString.stringify(request)}`;
    const response: BaseResponse<ListResponse<Show>> = await Api.get(url);
    const { data, message, success } = response;
    if (success && data) {
      setItems(data.items);
      setTotalCount(data.totalCount);
    } else { enqueueSnackbar(message, { variant: 'error' }); }
    setLoading(false);
  };

  useEffect(() => {
    if (showListResponse) {
      setItems(showListResponse.items);
      setTotalCount(showListResponse.totalCount);
    } else { enqueueSnackbar('Something is wrong with your connection!', { variant: 'error' }); }
  }, [props]);

  useEffect(() => {
    reloadShows(items.length);
  }, [sortBy]);

  const renderShowsHeader = () => (
    <>
      <Grid item xs={4} sm={6} md={9} lg={9} xl={10} style={{ paddingTop: 5 }}>
        <Typography variant='h1'>Shows</Typography>
      </Grid>
      <Grid item xs={8} sm={6} md={3} lg={3} xl={2}>
        <ShowsSortBySelector handleChange={(newValue: ShowsSortBy) => setSortBy(newValue)} value={sortBy} />
      </Grid>
    </>
  );

  const renderLoadMoreShowsIfNeeded = () => {
    if (loading || totalCount <= SHOWS_OFFSET || items.length === totalCount) { return null; }

    return (
      <Grid className={classes.buttonRow} item xs={12}>
        <LoadMoreButton
          text='View More Shows'
          handleClick={async () => { reloadShows(items.length + SHOWS_OFFSET); }}
        />
      </Grid>
    );
  };

  const renderShowItems = () => {
    if (loading) {
      return (
        <Grid item xs={12}>
          {' '}
          <CustomLoader />
        </Grid>
      );
    }
    return (
      <Grid item xs={12}>
        <ShowList items={items} />
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} alignItems='center'>
      {renderShowsHeader()}
      {renderShowItems()}
      {renderLoadMoreShowsIfNeeded()}
    </Grid>
  );
};

export default BandShows;
