import { makeStyles, SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { Colors } from 'src/constants';

const useStyles = makeStyles({
  root: {
    color: Colors.COLOR_6,
    fontSize: '1rem'
  }
});

type ButtonIconProps = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
};

const ButtonIcon = ({ Icon }: ButtonIconProps) => {
  const classes = useStyles();

  return <Icon className={classes.root} fontSize='small' />;
};

export default ButtonIcon;
