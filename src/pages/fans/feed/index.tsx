/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState } from 'react';
import { ApiRoutes, Colors } from 'src/constants';
import { layoutContainerId, navPaddingTop, navbarHeight } from 'src/constants/appConstants';
import { Button, Box, Grid, makeStyles } from '@material-ui/core';
import { BaseResponse, ListResponse, FanSpotlightDto, PagedAndSortedRequest, SpotlightSortBy } from 'src/types';
import { Api } from 'src/utils';
import { CustomLoader, Thumbnail } from 'src/components';
import { useNavigationStore, useSpotlightStore } from 'src/stores';
import { useRouter } from 'next/router';
import SpotlightsService from 'src/services/spotlightsService';
import { useAuth } from 'src/hooks';

const GRAY_BG = '#232323';

const useStyles = makeStyles({
  root: {
    backgroundColor: GRAY_BG,
    minHeight: `calc(100vh - ${navbarHeight}px)`,
    marginTop: navbarHeight - navPaddingTop
  },
  button: {
    border: '1px solid',
    backgroundColor: GRAY_BG,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    fontSize: '.7rem',
    '&:hover': {
      borderColor: 'inherit',
    },
    padding: '6px 10px 10px 10px'
  },
  gridItem: {
    backgroundColor: 'black',
    height: '37vh',
    position: 'relative'
  }
});

type FanFeedProps = {
  listResponse: ListResponse<FanSpotlightDto>;
};

const OFFSET = 5;

const FanFeed = ({ listResponse }: FanFeedProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SpotlightSortBy>(SpotlightSortBy.DateUploaded);
  const [totalCount, setTotalCount] = useState(0);
  const { spotlights, setSpotlights, setSelectedSpotlight, incrementViewsCount } = useSpotlightStore((state) => ({
    incrementViewsCount: state.incrementViewsCount,
    spotlights: state.spotlights,
    setSelectedSpotlight: state.setSelectedSpotlight,
    setSpotlights: state.setSpotlights
  }));
  const resetNavBar = useNavigationStore((state) => state.resetNavBar);
  const { user } = useAuth();
  const router = useRouter();

  const reloadItems = async (maxCount: number) => {
    setLoading(true);
    const request: PagedAndSortedRequest = {
      maxResultCount: maxCount,
      skipCount: 0,
      sorting
    };
    const response: BaseResponse<ListResponse<FanSpotlightDto>> = await Api.get(ApiRoutes.FansSpotlights.GetForFeed(request));
    const { data, success } = response;
    if (success) {
      setSpotlights(data.items);
      setTotalCount(data.totalCount);
    }
    setLoading(false);
  };

  const handleScroll = async () => {
    const element = document.getElementById('hiddenButton');
    if (!element) return;
    const position = element.getBoundingClientRect();
    const isAtBottom = position.top < (window.innerHeight + 1) && position.bottom >= 0;
    if (isAtBottom && !loading && spotlights.length < totalCount) {
      reloadItems(spotlights.length + OFFSET);
    }
  };

  useEffect(() => {
    const count = spotlights && spotlights.length > OFFSET ? spotlights.length : OFFSET;
    reloadItems(count);
  }, [sorting]);

  useEffect(() => {
    document.getElementById(layoutContainerId).addEventListener('scroll', handleScroll);
    return () => {
      document.getElementById(layoutContainerId).removeEventListener('scroll', handleScroll);
    };
  }, [spotlights, loading]);

  useEffect(() => {
    if (listResponse.totalCount > 0) {
      setSpotlights(listResponse.items);
      setTotalCount(listResponse.totalCount);
    }
    resetNavBar();
  }, [listResponse]);

  const openSpotlight = async (spotlight: FanSpotlightDto) => {
    setSelectedSpotlight(spotlight);
    await SpotlightsService.computeView(user, spotlight);
    incrementViewsCount();
    router.push('feed/spotlight');
  };

  const renderItems = () => spotlights.map((el) => (
    <Grid className={classes.gridItem} key={el.id} item xs={6}>
      <Thumbnail id={el.id} videoSrc={el.filePath} handleClick={() => openSpotlight(el)} />
    </Grid>
  ));

  const handleSortingClick = (newSort: SpotlightSortBy) => {
    setSorting(newSort);
  };

  const renderButton = (label: string, value: SpotlightSortBy) => {
    const color = value === sorting ? Colors.TERTIARY : 'white';
    return (
      <Button
        className={classes.button}
        variant='outlined'
        onClick={() => handleSortingClick(value)}
        style={{ borderColor: color, color }}
      >
        {label}
      </Button>
    );
  };

  const renderSortingRow = () => (
    <Box display='flex' justifyContent='space-around' alignContent='center' sx={{ py: 2 }}>
      {renderButton('Date Uploaded', SpotlightSortBy.DateUploaded)}
      {renderButton('Likes', SpotlightSortBy.Likes)}
      {renderButton('Views', SpotlightSortBy.Views)}
    </Box>
  );

  const renderLoading = () => {
    if (loading) return <CustomLoader />;
    return null;
  };

  return (
    <>
      <Box className={classes.root}>
        {renderSortingRow()}
        <Grid container spacing={0.5} width='100% !important'>
          {renderItems()}
        </Grid>
        {renderLoading()}
        <div id='hiddenButton' />
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const request: PagedAndSortedRequest = {
    maxResultCount: OFFSET,
    skipCount: 0,
    sorting: null
  };
  const response: BaseResponse<ListResponse<FanSpotlightDto>> = await Api.get(ApiRoutes.FansSpotlights.GetForFeed(request), context);
  const { data, success } = response;

  return { props: { listResponse: success ? data : [] } };
}

export default FanFeed;
