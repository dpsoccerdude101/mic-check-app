import { ReactNode } from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { CustomLabel } from 'src/components';
import CustomSelect from 'src/components/custom/customSelect';
import { useShowStore } from 'src/stores';
import MinimumAgeEnum from '../minimumAgeEnum';

const useStyles = makeStyles((theme) => ({
  title: {
    paddingBottom: `${theme.spacing(0)} !important`,
    paddingTop: `${theme.spacing(2)} !important`,
  },
  select: {
    background: 'white'
  }
}));

const AdmissionDetails = () => {
  const classes = useStyles();
  const { minimumAge, setMinimumAge } = useShowStore((state) => ({ minimumAge: state.minimumAge, setMinimumAge: state.setMinimumAge }));

  const options: ReactNode[] = [
    <option key={MinimumAgeEnum.All} value={MinimumAgeEnum.All}>All ages</option>,
    <option key={MinimumAgeEnum.Eighteen} value={MinimumAgeEnum.Eighteen}>18+</option>,
    <option key={MinimumAgeEnum.TwentyOne} value={MinimumAgeEnum.TwentyOne}>21+</option>,
  ];

  return (
    <>
      <Grid className={classes.title} item xs={12}>
        <Typography variant='h2'>Admission Details</Typography>
      </Grid>
      <Grid item xs={12}><CustomLabel bold={false} title='Age' /></Grid>
      <Grid item xs={12}>
        <CustomSelect
          className={classes.select}
          value={minimumAge}
          handleChange={(newValue) => setMinimumAge(newValue)}
          options={options}
        />
        {' '}
      </Grid>
    </>
  );
};

export default AdmissionDetails;
