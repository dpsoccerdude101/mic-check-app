/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { makeStyles } from '@material-ui/core';
import CustomImage from 'src/components/custom/customImage';

const useStyles = makeStyles({
  image: {
    height: '30vh',
    borderRadius: 10,
    width: '100%',
    objectFit: 'cover',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
});

type CardImageProps = {
  handleImageClick?: () => Promise<void>;
  imgSrc: string;
  title: string;
};

const CardImage = ({ handleImageClick, imgSrc, title }: CardImageProps) => {
  const classes = useStyles();
  const handleClick = () => {
    if (handleImageClick) { handleImageClick(); }
  };

  return (
    <CustomImage
      className={classes.image}
      imgSrc={imgSrc}
      title={title}
      extraProps={{
        onClick: handleClick
      }}
    />
  );
};

export default CardImage;
