import { FanSpotlightCommentDto } from 'src/types';
import { Colors } from 'src/constants';
import { Box, Container, Typography } from '@material-ui/core';
import RowWrapper from '../rowWrapper';
import UserAvatar from '../userAvatar';

type CommentItemProps = {
  comment: FanSpotlightCommentDto;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const { daysAgoString, text, writterProfilePicturePath, writterUsername } = comment;

  const avatarAndUsername = () => (
    <>
      <UserAvatar src={writterProfilePicturePath} />
      <Typography fontSize='small' variant='body2' color={Colors.TERTIARY}>{`@${writterUsername}`}</Typography>
    </>
  );

  return (
    <Container sx={{ pt: 3 }}>
      <RowWrapper>
        <Box display='flex' alignItems='center'>
          {avatarAndUsername()}
        </Box>
        <Typography fontSize='small' variant='body1' color='#A7B4BA'>{daysAgoString}</Typography>
      </RowWrapper>
      <Typography color='#3F4549' sx={{ pt: 2 }} fontSize='medium' variant='body2'>
        {text}
      </Typography>
    </Container>
  );
};

export default CommentItem;
