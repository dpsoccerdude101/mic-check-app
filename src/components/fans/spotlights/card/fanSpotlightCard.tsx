import { useState } from 'react';
import { FanSpotlightDto } from 'src/types';
import { Avatar, Grid, Typography, makeStyles } from '@material-ui/core';
import { Colors } from 'src/constants';
import { CardWrapper, CustomTag } from 'src/components';
import { Formatter } from 'src/utils';
import { FiberManualRecord } from '@material-ui/icons';
import CardMedia from './cardMedia';
import CardText from './cardText';
import LikeButton from './likeButton';
import LikeIcon from '../likeIcon';
import ShareButton from './shareButton';

const useStyles = makeStyles({
  avatar: {
    marginRight: 10
  },
  bottomActions: {
    padding: 10
  },
  centerElements: {
    display: 'flex',
    alignItems: 'center'
  },
  dot: {
    color: Colors.COLOR_5,
    fontSize: '.7rem',
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 5
  },
  title: {}
});

type FanSpotlightCardProps = {
  spotlight: FanSpotlightDto
};

const FanSpotlightCard = ({ spotlight }: FanSpotlightCardProps) => {
  const classes = useStyles();
  const { filePath, creationTime, creatorUsername, creatorProfilePicturePath, title, likesCount, show, viewsCount } = spotlight;
  const [realtimeViewsCount, setViewsCount] = useState(viewsCount);
  const [realtimeLikesCount, setLikesCount] = useState(likesCount);

  const handleViewIncrement = async () => {
    setViewsCount(viewsCount + 1);
  };

  const renderMedia = (): JSX.Element => (
    <CardMedia spotlight={spotlight} handleFirstPlay={handleViewIncrement} videoSrc={filePath} />
  );

  const numberToString = (number: number): string => {
    if (number === 0) { return 'No'; }

    return number.toString();
  };

  const numberLabel = (label: string, number: number): string => {
    if (number === 0 || number > 1) { return `${label}s`; }

    return label;
  };

  const textComponent = (text: string) => (
    <CardText text={text} />
  );

  const likeButton = () => (
    <LikeButton spotlight={spotlight} handleLike={(liked: boolean) => setLikesCount(liked ? (realtimeLikesCount + 1) : (realtimeLikesCount - 1))} />
  );

  const shareButton = () => <ShareButton />;
  const renderButtons = () => (
    <>
      <Grid item xs={4}>
        {likeButton()}
      </Grid>
      <Grid item xs={4}>
        {shareButton()}
      </Grid>
    </>
  );
  const renderCreator = () => {
    const userAvatar = <Avatar sx={{ width: 30, height: 30 }} className={classes.avatar} src={creatorProfilePicturePath} />;
    const userName = textComponent(creatorUsername);
    // Avatar with profile pic and name
    return (
      <Grid className={classes.centerElements} item xs={12}>
        {userAvatar}
        {userName}
      </Grid>
    );
  };

  // Heart icon and count of likes
  const renderLikes = () => {
    if (realtimeLikesCount === 0) { return null; }

    const count = numberToString(realtimeLikesCount);
    const likesText = numberLabel('Like', realtimeLikesCount);
    const likesTextComponent = textComponent(`${count} ${likesText}`);
    return (
      <Grid className={classes.centerElements} item xs={4}>
        <LikeIcon liked={false} />
        &nbsp;
        {likesTextComponent}
      </Grid>
    );
  };

  const renderCreationTimeTag = () => {
    if (!show) { return <Grid item xs={12} />; }

    const dateAndTime = Formatter.formatDateAndTime(creationTime);
    return <Grid item xs={8}><CustomTag text={dateAndTime} /></Grid>;
  };

  const renderViewsAndDate = () => {
    const count = numberToString(realtimeViewsCount);
    const viewsText = numberLabel('View', realtimeViewsCount);
    const views = textComponent(`${count} ${viewsText}`);
    const dot = <FiberManualRecord className={classes.dot} fontSize='small' />;
    const date = <CardText text={Formatter.formatDateToString(creationTime)} />;

    return (
      <Grid className={classes.centerElements} item xs={8}>
        <>
          {realtimeViewsCount > 0
            ? (
              <>
                {views}
                {dot}
              </>
            ) : null}
          {date}
        </>
      </Grid>
    );
  };

  return (
    <CardWrapper cardBottom={renderButtons()} cardTop={renderMedia()}>
      <>
        <Grid item xs={12} className={classes.title}>
          <Typography variant='h2'>{title}</Typography>
        </Grid>
        {renderViewsAndDate()}
        {renderLikes()}
        {renderCreationTimeTag()}
        {renderCreator()}
      </>
    </CardWrapper>
  );
};

export default FanSpotlightCard;
