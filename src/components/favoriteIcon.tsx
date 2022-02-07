import { useState } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { Helper } from 'src/utils';
import clsx from 'clsx';

const useStyles = makeStyles({
  filledFavorite: {
    color: 'red'
  },
  whiteCircle: {
    width: '2rem',
    height: '2rem',
    background: 'white',
    borderRadius: '50%',
    '&:hover': {
      background: 'white'
    }
  }
});

type FavoriteIconProps = {
  // returns success
  handleFavoriteClick: (newValue: boolean) => Promise<boolean>,
  isFavorite: boolean;
  iconOnly?: boolean;
  fontSize?: 'inherit' | 'large' | 'medium' | 'small';
  iconClassName?: string;
};

const FavoriteIcon = ({
  isFavorite,
  handleFavoriteClick,
  fontSize = 'small',
  iconOnly = false,
  iconClassName = ''
}: FavoriteIconProps) => {
  const [favoriteHover, setFavoriteHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const classes = useStyles();

  const renderFavoriteBandIcon = () => {
    const className = !clicked ? classes.filledFavorite : clsx(classes.filledFavorite, 'pulse');

    const filledFavorite = <Favorite className={className} fontSize={fontSize} />;
    const emptyFavorite = <FavoriteBorder className={iconClassName} fontSize={fontSize} />;
    if (isFavorite || favoriteHover) { return filledFavorite; }

    return emptyFavorite;
  };

  const pulse = async () => {
    setClicked(true);
    await Helper.wait(1);
    setClicked(false);
  };

  const handleClick = async (like: boolean) => {
    const success = await handleFavoriteClick(like);
    if (success) { pulse(); }
  };

  return (
    <IconButton
      onClick={(e) => { e.stopPropagation(); handleClick(!isFavorite); }}
      onMouseEnter={() => setFavoriteHover(true)}
      onMouseLeave={() => setFavoriteHover(false)}
      aria-label='favorite'
      className={iconOnly ? '' : classes.whiteCircle}
    >
      {renderFavoriteBandIcon()}
    </IconButton>
  );
};

export default FavoriteIcon;
