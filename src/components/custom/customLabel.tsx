import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  bold: {
    fontWeight: 600
  }
});

type CustomLabelProps = {
  bold?: boolean;
  title: string;
};

const CustomLabel = (props: CustomLabelProps) => {
  const { bold = true, title } = props;
  const classes = useStyles();
  return <Typography className={bold ? classes.bold : ''} variant='body1' color='primary'>{title}</Typography>;
};

export default CustomLabel;
