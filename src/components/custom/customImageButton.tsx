import { Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

type CustomImageButtonProps = {
  active: boolean;
  imageSrc: string;
  text: string;
  onClick: () => void;
};

const useStyles = makeStyles({
  wrapper: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '28vh'
  },
  active: {
    border: '3px solid black',
  },
  imageWrapper: {
    height: '25vh',
    width: '100%'
  },
  image: {
    width: '100%',
    height: '28vh',
    objectFit: 'contain',
    '&:focus': {
      outline: 'none'
    }
  },
  noOutline: {
    outline: 'none'
  },
  text: {
    paddingBottom: '4vh'
  }
});

const CustomImageButton = (props: CustomImageButtonProps) => {
  const { active = false, imageSrc, onClick, text } = props;
  const classes = useStyles();
  const wrapperClassName = active ? clsx(classes.wrapper, classes.active) : classes.wrapper;
  return (
    <div role='button' className={clsx(wrapperClassName, classes.noOutline)} onClick={onClick} tabIndex={0} onKeyDown={onClick}>
      <div className={clsx(classes.imageWrapper, classes.noOutline)}>
        <img src={imageSrc} className={clsx(classes.noOutline, classes.image)} alt={text} />
      </div>
      <Typography
        component='span'
        variant='subtitle1'
        color='inherit'
        className={clsx(classes.noOutline, classes.text)}
      >
        {text}
      </Typography>
    </div>
  );
};

CustomImageButton.propTypes = {
  active: PropTypes.bool,
  imageSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default CustomImageButton;
