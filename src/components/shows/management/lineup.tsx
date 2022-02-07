import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useShowStore } from 'src/stores';
import { v4 as uuidv4 } from 'uuid';
import BandShow from './showBand';

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: `${theme.spacing(2)} !important`,
  },
  button: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(3)
  }
}));

type LineupProps = {
  isSubmitting: boolean;
};

const Lineup = ({ isSubmitting }: LineupProps) => {
  const { bands, addBand } = useShowStore((state) => ({ bands: state.bands, addBand: state.addBand }));
  const classes = useStyles();

  const renderLineups = () => bands.map((el, i) => (
    <BandShow
      key={uuidv4()}
      index={i}
      band={el.band}
      startTime={el.startTime}
      endTime={el.endTime}
    />
  ));

  return (
    <>
      <Grid className={classes.title} item xs={12}>
        <Typography variant='h2'>Lineup</Typography>
      </Grid>
      {renderLineups()}
      <Grid item xs={12} className={classes.button}>
        <Button disabled={isSubmitting} onClick={addBand} variant='outlined'>Add Band</Button>
      </Grid>
    </>
  );
};

export default Lineup;
