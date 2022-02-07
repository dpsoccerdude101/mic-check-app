import { useState } from 'react';
import { useAuth, useSpotlights } from 'src/hooks';
import { Button, Divider, Grid, Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import { Colors } from 'src/constants';
import { BandFansSpotlightsList } from 'src/components';
import clsx from 'clsx';
import SpotlightSortBySelector from 'src/components/fans/spotlights/spotlightSortBySelector';
import FanSpotlightsModal from './fanSpotlightsModal';

const useStyles = makeStyles((theme) => ({
  gridUpload: {
    marginBottom: 20
  },
  centeredElements: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    paddingBottom: 15
  },
  dottedSquare: {
    padding: '40px',
    width: '100%',
    border: '1px dashed gray',
    borderRadius: 8,
    backgroundColor: Colors.QUATERNARY
  },
  shareText: {
    fontSize: '1.2rem',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.1rem',
      textAlign: 'left'
    },
  },
  sortByLabel: {
    paddingTop: '16px !important'
  },
  uploadButton: {
    [theme.breakpoints.down('md')]: {
      marginTop: 20,
    },
    width: 200
  }
}));

type FanSpotlightsTabProps = {
  bandId: string;
  bandName: string;
};

const FanSpotlightsTab = ({ bandId, bandName }: FanSpotlightsTabProps) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const { sortBy, setSortBy, spotlights } = useSpotlights();
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  const uploadText = () => (
    <Typography className={classes.shareText} variant='body1' color='primary'>
      Share a moment with other fans.
      {mdUp ? <br /> : null}
      Upload your own spotlight videos.
    </Typography>
  );

  const uploadButton = () => <Button onClick={() => setOpen(true)} className={classes.uploadButton} variant='contained' color='primary'>Upload Spotlight</Button>;

  const renderUploadDivMdUp = () => (
    <Grid className={classes.dottedSquare} container>
      <Grid item md={8} lg={9}>
        {uploadText()}
      </Grid>
      <Grid item md={4} lg={3}>
        {uploadButton()}
      </Grid>
    </Grid>
  );

  const renderUploadDivMdDown = () => (
    <div className={clsx(classes.centeredElements, classes.dottedSquare)}>
      {uploadText()}
      {uploadButton()}
    </div>
  );

  const renderUploadDiv = () => {
    const { isFan } = user;
    if (!isFan) return null;
    const component = mdUp ? renderUploadDivMdUp() : renderUploadDivMdDown();
    return (
      <Grid className={classes.gridUpload} item xs={12} md={9}>
        {component}
      </Grid>
    );
  };

  const renderTitleIfNeeded = () => {
    if (!mdUp) return null;
    return (
      <>
        <Grid item md={12}><Typography variant='h1'>Fan Spotlights</Typography></Grid>
        <Grid className={classes.divider} item md={12}><Divider /></Grid>
      </>
    );
  };

  const renderSortByIfNeeded = () => {
    const { length } = spotlights;
    if (!mdUp || length === 0) return null;
    return (
      <Grid item md={3}>
        <Grid container spacing={1}>
          <Grid className={classes.sortByLabel} item md={12}><Typography variant='h2'>Sort by</Typography></Grid>
          <Grid item md={12}>
            <SpotlightSortBySelector value={sortBy} handleChange={(newValue) => setSortBy(newValue)} />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderNoSpotlightsIfNeeded = () => {
    const { isFan } = user;
    const { length } = spotlights;
    if (length > 0 || isFan) { return null; }

    return <Grid item xs={12}><Typography variant='body2'>No spotlights yet.</Typography></Grid>;
  };

  const renderFillerForNonFan = () => {
    const { isFan } = user;
    if (isFan) return null;
    return <Grid item xs={12} />;
  };

  return (
    <>
      <FanSpotlightsModal bandId={bandId} open={isOpen} bandName={bandName} handleClose={() => setOpen(false)} />
      {renderTitleIfNeeded()}
      {renderNoSpotlightsIfNeeded()}
      {renderUploadDiv()}
      {renderSortByIfNeeded()}
      {renderFillerForNonFan()}
      <BandFansSpotlightsList bandId={bandId} />
    </>
  );
};

export default FanSpotlightsTab;
