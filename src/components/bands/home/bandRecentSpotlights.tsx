import { useSpotlights } from 'src/hooks';
import { Grid, Typography } from '@material-ui/core';
import { BandFansSpotlightsList } from 'src/components';
import { AppConstants } from 'src/constants';
import Cookies from 'js-cookie';

const BandRecentSpotlights = () => {
  const { spotlights } = useSpotlights();
  const bandId = Cookies.get(AppConstants.bandIdLabel);

  const renderSpotlightsHeader = () => {
    if (spotlights.length === 0) { return null; }

    return (
      <Grid pb={1} item xs={12}>
        <Typography variant='h1' component='h2'>Recent Fan Spotlights</Typography>
      </Grid>
    );
  };

  const renderComponent = () => (
    <Grid pt={2} container spacing={2}>
      {renderSpotlightsHeader()}
      <BandFansSpotlightsList bandId={bandId} />
    </Grid>
  );

  return renderComponent();
};

export default BandRecentSpotlights;
