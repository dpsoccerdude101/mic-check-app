import { makeStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { Colors } from 'src/constants';
import { fontSize } from '@material-ui/system';

const useStyles = makeStyles({
  root: {
    marginTop: 12,
    marginLeft: 5,
    fontSize: '0.65rem',
    lineHeight: '1rem',
    fontFamily: 'acumin-pro',
    fontWeight: 400,
    backgroundColor: '#BDBDBD'
  },
});

type CustomTagProps = {
  text: string;
};

const CustomTag = ({ text }: CustomTagProps) => {
  const classes = useStyles();
  return <Chip color='primary' size='small' label={text} className={classes.root} />;
};

export default CustomTag;
