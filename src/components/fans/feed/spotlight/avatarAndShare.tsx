import { Box, Typography } from '@material-ui/core';
import { UiRoutes } from 'src/constants';
import { useSnackbar } from 'notistack';
import RowWrapper from './rowWrapper';
import ShareIcon from './shareIcon';
import UserAvatar from './userAvatar';

type AvatarAndShareProps = {
  id: string;
  creatorProfilePicturePath: string;
  creatorUsername: string;
  title: string;
};

const AvatarAndShare = ({ id, creatorProfilePicturePath, creatorUsername, title }: AvatarAndShareProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleShareClick = async () => {
    const clientURL = window.location.origin;
    const spotlightUrl = `${clientURL}${UiRoutes.Fans.Feed.Spotlight}/${id}`;
    const shareText = `Check out this spotlight of ${title}!\n${spotlightUrl}`;
    if (navigator.share) {
      await navigator.share({
        title,
        text: shareText,
        url: spotlightUrl
      });
    } else {
      navigator.clipboard.writeText(shareText);
      enqueueSnackbar('Copied with success!', { variant: 'success' });
    }
  };
  return (
    <RowWrapper>
      <Box
        display='flex'
        alignItems='center'
      >
        <UserAvatar src={creatorProfilePicturePath} />
        <Typography fontSize='small' variant='body2' color='white' component='span'>
          {`@${creatorUsername}`}
        </Typography>
      </Box>
      <ShareIcon handleClick={handleShareClick} />
    </RowWrapper>
  );
};

export default AvatarAndShare;
