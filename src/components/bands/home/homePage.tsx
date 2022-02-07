import { PageWrapper } from 'src/components';
import BandRecentSpotlights from './bandRecentSpotlights';
import BandShows from './bandShows';
import BandShowsProps from './bandShowsProps';

const MyBandHome = (props: BandShowsProps) => {
  const { showListResponse } = props;
  return (
    <PageWrapper title='Band Homepage'>
      <BandShows showListResponse={showListResponse} />
      <BandRecentSpotlights />
    </PageWrapper>
  );
};

export default MyBandHome;
