import { useEffect, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useSpotlights } from 'src/hooks';
import { CustomLoader, LoadMoreButton } from 'src/components';
import { BaseResponse, FanSpotlightDto, FanSpotlightBandQueryRequest, ListResponse } from 'src/types';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import FanSpotlightCard from '../fans/spotlights/card/fanSpotlightCard';

const useStyles = makeStyles({
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

const SPOTLIGHTS_OFFSET = 6;
type SpotlightsListProps = {
  bandId: string;
};
const BandFansSpotlightsList = ({ bandId }: SpotlightsListProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { sortBy, spotlights, setSpotlights } = useSpotlights();
  const [totalCount, setTotalCount] = useState(spotlights.length);
  const { enqueueSnackbar } = useSnackbar();

  const loadSpotlights = async (maxCount: number) => {
    setLoading(true);
    const request: FanSpotlightBandQueryRequest = {
      bandId,
      skipCount: 0,
      maxResultCount: maxCount > 0 ? maxCount : SPOTLIGHTS_OFFSET,
      sorting: sortBy
    };
    const response: BaseResponse<ListResponse<FanSpotlightDto>> = await Api.get(ApiRoutes.FansSpotlights.GetFromBand(request));
    const { data, message, success } = response;
    if (success) {
      const { items } = data;
      setSpotlights(items);
      setTotalCount(data.totalCount);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSpotlights(0);
  }, [bandId]);

  useEffect(() => {
    loadSpotlights(spotlights.length);
  }, [sortBy]);

  const list = () => (spotlights.map((spotlight) => (
    <Grid key={spotlight.id} item xs={12} md={6} lg={4}>
      <FanSpotlightCard spotlight={spotlight} />
    </Grid>
  )));

  const renderLoadMoreIfNeeded = () => {
    if (totalCount <= SPOTLIGHTS_OFFSET || spotlights.length === totalCount) return null;

    return (
      <Grid
        className={classes.buttonRow}
        item
        xs={12}
      >
        <LoadMoreButton
          text='View More Fan Spotlights'
          handleClick={async () => { loadSpotlights(spotlights.length + SPOTLIGHTS_OFFSET); }}
        />
      </Grid>
    );
  };

  const renderComponent = () => {
    if (loading) return <Grid item xs={12}><CustomLoader /></Grid>;
    return (
      <>
        {list()}
        {renderLoadMoreIfNeeded()}
      </>
    );
  };

  return renderComponent();
};

export default BandFansSpotlightsList;
