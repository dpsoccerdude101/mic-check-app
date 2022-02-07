import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  baseDot: {
    display: 'inline-block',
    marginBottom: '-2px',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: '0.5px',
    height: '.6rem',
    width: '.6rem'
  },
});

type CircleDotProps = {
  size?: string,
  mh?: string,
  color: string,
};

const CircleDot = ({ size = '.6rem', color, mh = '0' }: CircleDotProps) => {
  const classes = useStyles();
  return (
    <span
      className={classes.baseDot}
      style={{
        height: size,
        width: size,
        borderColor: color,
        background: color,
        marginLeft: mh,
        marginRight: mh
      }}
    />
  );
};
export default CircleDot;
