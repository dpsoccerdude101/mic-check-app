/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { makeStyles } from '@material-ui/core';
import FavoriteBandIcon from './favoriteBandIcon';
import CardImage from './fans/cards/cardImage';

const useStyles = makeStyles({
  iconWrapper: {
    display: 'flex',
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

type ImageWithFavoriteIconProps = {
  bandId: string,
  handleFavoriteClick: (newValue: boolean) => Promise<void>,
  handleImageClick?: () => Promise<void>,
  imgString: string,
  imgTitle: string,
  isFavorite: boolean
};

const ImageWithFavoriteIcon = ({ bandId, imgString, imgTitle, isFavorite, handleFavoriteClick, handleImageClick }: ImageWithFavoriteIconProps) => {
  const classes = useStyles();
  return (
    <>
      <CardImage handleImageClick={handleImageClick} imgSrc={imgString} title={imgTitle} />
      <div className={classes.iconWrapper}>
        <FavoriteBandIcon bandId={bandId} isFavorite={isFavorite} handleFavoriteClick={handleFavoriteClick} />
      </div>
    </>
  );
};

export default ImageWithFavoriteIcon;
