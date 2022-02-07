import { Typography, makeStyles } from '@material-ui/core';
import { FavoriteIcon } from 'src/components';
import { useSpotlightStore } from 'src/stores';
import { BaseResponse } from 'src/types';
import { SpotlightsService } from 'src/services';
import { useAuth } from 'src/hooks';
import { useSnackbar } from 'notistack';
import RowWrapper from './rowWrapper';

const useStyles = makeStyles({
  icon: {
    color: 'white'
  }
});

const TitleAndLike = () => {
  const {
    isFavorite,
    setIsFavorite,
    incrementLikesCount,
    decrementLikesCount,
    selectedSpotlight,
    setShowSignInBanner,
    title
  } = useSpotlightStore((state) => (
    {
      incrementLikesCount: state.incrementLikesCount,
      decrementLikesCount: state.decrementLikesCount,
      isFavorite: state.isFavorite,
      setIsFavorite: state.setIsFavorite,
      selectedSpotlight: state.selectedSpotlight,
      setShowSignInBanner: state.setShowSignInBanner,
      title: state.title
    }));

  const classes = useStyles();
  const { isAuthenticated, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleFavoriteClick = async (newValue: boolean): Promise<boolean> => {
    if (!isAuthenticated) {
      setShowSignInBanner(true);
      return false;
    }

    const response: BaseResponse = await SpotlightsService.reactToSpotlight(selectedSpotlight, newValue, user);
    const { success, message } = response;
    if (success) {
      setIsFavorite(newValue);
      if (newValue) {
        incrementLikesCount();
      } else {
        decrementLikesCount();
      }
      return true;
    }
    enqueueSnackbar(message, { variant: 'error' });
    return false;
  };

  const favoriteIcon = () => (
    <FavoriteIcon
      isFavorite={isFavorite}
      handleFavoriteClick={handleFavoriteClick}
      fontSize='medium'
      iconOnly
      iconClassName={classes.icon}
    />
  );

  return (
    <RowWrapper>
      <Typography
        fontWeight='600'
        fontSize='1rem'
        variant='body2'
        color='white'
      >
        {title}
      </Typography>
      {favoriteIcon()}
    </RowWrapper>
  );
};

export default TitleAndLike;
