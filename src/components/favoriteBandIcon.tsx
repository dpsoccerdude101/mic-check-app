import { useAuth } from 'src/hooks';
import { ApiRoutes } from 'src/constants';
import { useSnackbar } from 'notistack';
import { Api } from 'src/utils';
import type { BaseResponse, LikeBandRequest } from 'src/types';
import FavoriteIcon from './favoriteIcon';

type FavoriteBandIconProps = {
  bandId: string,
  handleFavoriteClick: (newValue: boolean) => Promise<void>,
  isFavorite: boolean
};

const FavoriteBandIcon = ({ bandId, isFavorite, handleFavoriteClick }: FavoriteBandIconProps) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = async (like: boolean): Promise<boolean> => {
    const request: LikeBandRequest = {
      userId: user.id,
      bandId,
      like
    };

    const response: BaseResponse = await Api.post(ApiRoutes.Fans.LikeBand, request);
    const { success, message } = response;
    if (success) {
      handleFavoriteClick(request.like);
      return true;
    }
    enqueueSnackbar(message, { variant: 'error' });
    return false;
  };

  return (
    <FavoriteIcon isFavorite={isFavorite} handleFavoriteClick={handleClick} />
  );
};

export default FavoriteBandIcon;
