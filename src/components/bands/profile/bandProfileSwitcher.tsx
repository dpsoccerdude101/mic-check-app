import { useBand } from 'src/hooks';
import { useBandGeneral } from 'src/hooks/useBand';
import BandEditProfileHeader from './edit/bandEditProfileHeader';
import BandEditProfileTabs from './edit/bandEditProfileTabs';
import BandProfilePreview from './bandProfilePreview';

const BandProfileSwitcher = () => {
  const { band, showPreview } = useBand();
  const { profilePicture } = useBandGeneral();

  return (
    showPreview ? <BandProfilePreview band={band} profilePicture={profilePicture} /> : (
      <>
        <BandEditProfileHeader />
        <BandEditProfileTabs />
      </>
    )
  );
};

export default BandProfileSwitcher;
