import { Band, FileModel } from 'src/types';
import { makeStyles } from '@material-ui/core';
import { useBandGeneral, useBandLinks } from 'src/hooks/useBand';
import BandSocialMedia from 'src/types/band/bandSocialMedia';
import BandProfileHeader from './bandProfileHeader';
import BandProfileTabs from './bandProfileTabs';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '-44px',
    marginRight: '-44px',
    marginTop: '-16px',
    [theme.breakpoints.up('md')]: {
      marginTop: -22
    },
    [theme.breakpoints.down('md')]: {
      marginTop: -21,
    },
    [theme.breakpoints.only('xs')]: {
      marginLeft: -36,
      marginRight: -36,
    }
  }
}));

type BandProfilePreviewProps = {
  band: Band,
  profilePicture?: FileModel
};

const BandProfilePreview = ({ band, profilePicture }: BandProfilePreviewProps) => {
  const { id } = band;
  const { description, name, hometown, selectedGenreTags } = useBandGeneral();
  const { links } = useBandLinks();
  let socialMedias: BandSocialMedia[] = [];
  if (links.length > 0) { socialMedias = links; } else { socialMedias = band.socialMedias; }
  const classes = useStyles();
  let imgSrc: string = '';
  if (profilePicture) {
    imgSrc = profilePicture.srcString;
  }

  return (
    <div className={classes.root}>
      <BandProfileHeader bandId={id} isPreview hometown={hometown} imgSrc={imgSrc} name={name} genreTags={selectedGenreTags} />
      <BandProfileTabs bandId={id} name={name} description={description} hometown={hometown} socialMedias={socialMedias} />
    </div>
  );
};

export default BandProfilePreview;
