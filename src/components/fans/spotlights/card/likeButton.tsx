import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { BaseResponse, FanSpotlightDto } from 'src/types';
import { TrackActions } from 'src/constants';
import { useAuth } from 'src/hooks';
import { CircularProgress } from '@material-ui/core';
import TrackService from 'src/services/trackService';
import SpotlightsService from 'src/services/spotlightsService';
import CardButton from './cardButton';
import LikeIcon from '../likeIcon';

type LikeButtonProps = {
  spotlight: FanSpotlightDto;
  handleLike: (liked: boolean) => void;
};

const LikeButton = ({ spotlight, handleLike }: LikeButtonProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = spotlight;
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkIfUserLiked = async () => {
      const userLiked = await SpotlightsService.checkIfUserLiked(id);
      if (mounted) {
        if (userLiked !== liked) { setLiked(userLiked); }
        setLoading(false);
      }
    };

    checkIfUserLiked();
    return () => {
      mounted = false;
    };
  }, [id]);

  const trackReaction = (isLike: boolean) => {
    const action = isLike ? TrackActions.USER_LIKED_SPOTLIGHT : TrackActions.USER_DISLIKED_SPOTLIGHT;
    const spotlightTrackObj = TrackService.getSpotlightTrackObj(spotlight);
    TrackService.trackAction(action, spotlightTrackObj, user);
  };

  const handleClick = async () => {
    const isLike = !liked;
    const response: BaseResponse = await SpotlightsService.reactToSpotlight(spotlight, isLike, user);
    const { message, success } = response;
    if (success) {
      handleLike(isLike);
      setLiked(isLike);
      trackReaction(isLike);
    } else { enqueueSnackbar(message, { variant: 'error' }); }
  };

  const buttonText = liked ? 'Liked' : 'Like';
  const renderComponent = () => {
    if (loading) { return <CircularProgress />; }

    return <CardButton handleClick={handleClick} startIcon={<LikeIcon liked={liked} />} text={buttonText} />;
  };
  return renderComponent();
};

export default LikeButton;
