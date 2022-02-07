import { useSpotlightStore } from 'src/stores';
import { Box, Typography, IconButton, makeStyles } from '@material-ui/core';
import { CircleDot } from 'src/components';
import { SmsOutlined } from '@material-ui/icons';
import { Formatter } from 'src/utils';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks';
import LikesCount from './likesCount';
import RowWrapper from './rowWrapper';

const useStyles = makeStyles({
  icon: {
    color: 'white',
    transform: 'scaleX(-1)'
  },
  showDateTag: {
    padding: '6px 8px 7px 8px',
    backgroundColor: '#696A72',
    marginBottom: 10,
    borderRadius: 5,
    width: 'fit-content'
  }
});

const LikesAndDate = () => {
  const classes = useStyles();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { creationTime, showDateStr, likesCount, setShowSignInBanner, viewsCount } = useSpotlightStore((state) => ({
    creationTime: state.creationTime,
    likesCount: state.likesCount,
    setShowSignInBanner: state.setShowSignInBanner,
    showDateStr: state.showDateStr,
    viewsCount: state.viewsCount
  }));

  const hasLikes = likesCount > 0;
  const hasViews = viewsCount > 0;
  const viewsText = viewsCount === 1 ? 'View' : 'Views';
  const dot = <CircleDot mh='.3rem' size='.2rem' color='white' />;
  const textComponent = (text: string) => (
    <Typography variant='body2' fontSize='small' color='white'>
      {text}
    </Typography>
  );

  const openComment = () => {
    if (!isAuthenticated) {
      setShowSignInBanner(true);
    } else { router.push('spotlight/comments'); }
  };

  return (
    <RowWrapper>
      <Box display='flex' flexDirection='column'>
        {showDateStr && (
          <div className={classes.showDateTag}>
            {textComponent(showDateStr)}
          </div>
        )}
        <Box display='flex' alignItems='center'>
          {hasLikes && (
            <>
              <LikesCount count={likesCount} />
              {dot}
            </>
          )}
          {hasViews && (
            <>
              {textComponent(`${viewsCount} ${viewsText}`)}
              {dot}
            </>
          )}
          {textComponent(Formatter.formatDateToString(creationTime))}
        </Box>
      </Box>
      <IconButton onClick={openComment}>
        <SmsOutlined className={classes.icon} fontSize='medium' />
      </IconButton>
    </RowWrapper>
  );
};

export default LikesAndDate;
