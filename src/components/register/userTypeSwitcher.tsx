import { Grid, makeStyles } from '@material-ui/core';
import { Images } from 'src/constants';
import { CustomLabel, CustomImageButton } from 'src/components';
import { UserTypeEnum } from 'src/types';

const useStyles = makeStyles({
  noOutline: {
    outline: 'none'
  }
});

type UserTypeSwitcherProps = {
  handleChange: (selectedType: UserTypeEnum) => void;
  value: UserTypeEnum
};

const UserTypeSwitcher = ({ handleChange, value }: UserTypeSwitcherProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12}>
        <CustomLabel title='Who are you?' />
      </Grid>
      <Grid className={classes.noOutline} item xs={6}>
        <CustomImageButton
          active={value === UserTypeEnum.Band}
          imageSrc={Images.BandLogoSignup}
          text="I'm a band"
          onClick={() => {
            handleChange(UserTypeEnum.Band);
          }}
        />
      </Grid>
      <Grid className={classes.noOutline} item xs={6}>
        <CustomImageButton
          active={value === UserTypeEnum.Fan}
          imageSrc={Images.FanLogoSignup}
          text="I'm a fan"
          onClick={() => {
            handleChange(UserTypeEnum.Fan);
          }}
        />
      </Grid>
    </>
  );
};

export default UserTypeSwitcher;
