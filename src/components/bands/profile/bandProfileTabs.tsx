import { useState, ReactNode } from 'react';
import { useBand } from 'src/hooks';
import { CustomLoader } from 'src/components';
import { Box, Grid, ToggleButton, ToggleButtonGroup, makeStyles } from '@material-ui/core';
import { SpotlightsProvider } from 'src/contexts';
import BandSocialMedia from 'src/types/band/bandSocialMedia';
import FanSpotlightsTab from './spotlightsTab/fanSpotlightsTab';
import BandProfileContainer from './bandProfileContainer';
import AboutTab from './aboutTab';
import OverviewTab from './overviewTab';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '5vw',
    paddingRight: '5vw',
    paddingBottom: '5vw'
  },
  tabItem: {
    background: 'transparent !important',
    color: 'rgba(17,20,45,0.5) !important',
    fontSize: '.8rem',
    fontWeight: 600,
    paddingLeft: 0,
    '&.Mui-selected': {
      color: 'black !important',
      '&::before': {
        content: '\'\'',
        display: 'block',
        position: 'absolute',
        bottom: '10%',
        width: '40%',
        borderBottom: '3px solid #FFBB00'
      }
    }
  },
  tabSelector: {
    paddingTop: 10,
    [theme.breakpoints.down('md')]: {
      paddingTop: 20
    }
  }
}));

enum BandProfileTabsEnum {
  ABOUT = 'ABOUT',
  FAN_SPOTLIGHTS = 'FAN_SPOTLIGHTS',
  OVERVIEW = 'OVERVIEW',

}

type BandProfileTabsType = 'OVERVIEW' | 'ABOUT' | 'FAN_SPOTLIGHTS';

type BandProfileTabsProps = {
  bandId: string;
  description: string;
  hometown: string;
  name: string;
  socialMedias: BandSocialMedia[];
};

const BandProfileTabs = ({ bandId, description, name, hometown, socialMedias }: BandProfileTabsProps) => {
  const [tabSelected, selectTab] = useState<BandProfileTabsType>('OVERVIEW');
  const classes = useStyles();
  const { isLoading: loading } = useBand();

  // Commented because its not developed yet
  const renderTabSelectors = (): ReactNode => (
    <ToggleButtonGroup className={classes.tabSelector} value={tabSelected} onChange={(e, newValue) => selectTab(newValue)} exclusive aria-label='Band Profile Tabs'>
      <ToggleButton className={classes.tabItem} value={BandProfileTabsEnum.OVERVIEW} aria-label='Overview'>Overview</ToggleButton>
      <ToggleButton className={classes.tabItem} value={BandProfileTabsEnum.ABOUT} aria-label='About'>About</ToggleButton>
      <ToggleButton className={classes.tabItem} value={BandProfileTabsEnum.FAN_SPOTLIGHTS} aria-label='Fans Spotlights'>Fan Spotlights</ToggleButton>
    </ToggleButtonGroup>
  );

  const renderSelectedTab = (): ReactNode => {
    switch (tabSelected) {
      case BandProfileTabsEnum.OVERVIEW:
        return <OverviewTab bandId={bandId} />;

      case BandProfileTabsEnum.ABOUT:
        return <AboutTab hometown={hometown} description={description} socialMedias={socialMedias} />;

      default:
        return <SpotlightsProvider><FanSpotlightsTab bandId={bandId} bandName={name} /></SpotlightsProvider>;
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <CustomLoader />
      );
    }

    return (
      <Box sx={{ pb: 2 }}>
        <BandProfileContainer>
          <Grid item xs={12}>
            {renderTabSelectors()}
          </Grid>
          {renderSelectedTab()}
        </BandProfileContainer>
      </Box>
    );
  };

  return renderBody();
};

export default BandProfileTabs;
