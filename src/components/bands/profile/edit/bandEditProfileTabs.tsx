import { useState, ReactNode } from 'react';
import { useBand } from 'src/hooks';
import { CustomLoader, GeneralTab, LinksTab, VideosTab } from 'src/components';
import { ToggleButton, ToggleButtonGroup, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  tabSelector: {
    paddingBottom: 20,
    paddingTop: 20
  }
});

enum EditProfileTabs {
  GENERAL = 'GENERAL',
  LINKS = 'LINKS',
  VIDEOS = 'VIDEOS'
}

type EditProfileTabsType = 'GENERAL' | 'LINKS' | 'VIDEOS';

const BandEditProfileTabs = () => {
  const [tabSelected, selectTab] = useState<EditProfileTabsType>('GENERAL');
  const classes = useStyles();
  const { isLoading: loading } = useBand();

  const renderTabSelectors = (): ReactNode => (
    <ToggleButtonGroup className={classes.tabSelector} value={tabSelected} onChange={(e, newValue) => selectTab(newValue)} exclusive aria-label='Band Profile Tabs'>
      <ToggleButton value={EditProfileTabs.GENERAL} aria-label='General'>General</ToggleButton>
      <ToggleButton value={EditProfileTabs.LINKS} aria-label='Links'>Links</ToggleButton>
      <ToggleButton value={EditProfileTabs.VIDEOS} aria-label='Videos'>Videos</ToggleButton>
    </ToggleButtonGroup>
  );

  const renderSelectedTab = (): ReactNode => {
    switch (tabSelected) {
      case EditProfileTabs.LINKS:
        return <LinksTab />;

      case EditProfileTabs.VIDEOS:
        return <VideosTab />;

      default:
        return <GeneralTab />;
    }
    return null;
  };

  const renderBody = () => {
    if (loading) {
      return (
        <CustomLoader />
      );
    }

    return (
      <>
        {renderTabSelectors()}
        {renderSelectedTab()}
      </>
    );
  };

  return renderBody();
};

export default BandEditProfileTabs;
