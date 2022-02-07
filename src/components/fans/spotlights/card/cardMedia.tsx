import { ApiRoutes } from 'src/constants';
import { FanSpotlightDto } from 'src/types';
import { VideoPlayer } from 'src/components';
import { useAuth, useSpotlights } from 'src/hooks';
import SpotlightsService from 'src/services/spotlightsService';
import DeleteMediaIcon from './deleteMediaIcon';

type CardMediaProps = {
  handleFirstPlay: () => void;
  spotlight: FanSpotlightDto;
  videoSrc: string;
};

const CardMedia = ({ spotlight, handleFirstPlay, videoSrc }: CardMediaProps) => {
  const { user } = useAuth();
  const { id } = spotlight;
  const { deleteSpotlight } = useSpotlights();
  const countView = async () => {
    await SpotlightsService.computeView(user, spotlight);
    handleFirstPlay();
  };

  const renderDeleteIfAdmin = () => {
    const { isAdmin } = user;
    if (isAdmin) {
      return (
        <DeleteMediaIcon
          deleteCallback={(deleted: boolean) => (deleted ? deleteSpotlight(id) : null)}
          deleteUrl={ApiRoutes.FansSpotlights.DeleteSpotlight(id)}
        />
      );
    }

    return null;
  };
  return (
    <>
      <VideoPlayer handleFirstPlay={countView} videoSrc={videoSrc} />
      {renderDeleteIfAdmin()}
    </>
  );
};

export default CardMedia;
