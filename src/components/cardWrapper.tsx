import { Divider, Grid, makeStyles } from '@material-ui/core';
import { ChildrenProps } from 'src/types';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    background: 'white',
    borderRadius: 5,
    marginBottom: '5vh',
    WebkitBoxShadow: '0px 1px 4px 1px #ececec',
    MozBoxShadow: '0px 1px 4px 1px #ececec',
    BoxShadow: '0px 1px 4px 1px #ececec',
  },
  top: {
    position: 'relative',
    display: 'block',
    paddingBottom: 10
  },
  body: {
    paddingTop: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 10
  },
  bottomSpace: {
    paddingBottom: 20
  }
});

type CardWrapperProps = ChildrenProps & {
  cardBottom?: JSX.Element;
  cardTop: JSX.Element;
  handleClick?: () => void;
  wrapperClass?: string
};

const CardWrapper = ({ handleClick, cardBottom, cardTop, children, wrapperClass = '' }: CardWrapperProps) => {
  const classes = useStyles();
  const bodyClassName = cardBottom ? classes.body : clsx(classes.body, classes.bottomSpace);

  const renderBottomIfExists = () => {
    if (!cardBottom) { return null; }

    return (
      <>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid container spacing={1} className={classes.body}>
          {cardBottom}
        </Grid>
      </>
    );
  };

  return (
    <Grid
      onClick={handleClick}
      container
      className={clsx(classes.root, wrapperClass)}
      style={{ cursor: handleClick ? 'pointer' : 'default' }}
    >
      <Grid item xs={12} className={classes.top}>
        {cardTop}
      </Grid>
      <Grid container spacing={1} className={bodyClassName}>
        {children}
      </Grid>
      {renderBottomIfExists()}
    </Grid>
  );
};

export default CardWrapper;
