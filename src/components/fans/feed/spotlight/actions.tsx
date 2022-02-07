import { makeStyles } from '@material-ui/core';
import { navPaddingTop, navbarHeight } from 'src/constants/appConstants';
import { useSpotlightStore } from 'src/stores';
import AvatarAndShare from './avatarAndShare';
import LikesViewsComments from './likesViewsComments';
import TitleAndLike from './titleAndLike';

const marginTop = (navbarHeight - navPaddingTop);
const useStyles = makeStyles({
  root: {
    marginTop,
    height: `calc(100vh - ${navbarHeight}px)`,
    position: 'relative'
  },
  actionsDiv: {
    height: '30vh',
    width: '90%',
    marginLeft: '5%',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    background: 'black',
    opacity: '.3',
    pointerEvents: 'none'
  },

});

const Actions = () => {
  const classes = useStyles();
  const { id, creatorProfilePicturePath, creatorUsername, title } = useSpotlightStore((state) => (
    {
      id: state.id,
      creatorProfilePicturePath: state.creatorProfilePicturePath,
      creatorUsername: state.creatorUsername,
      title: state.title
    }
  ));

  return (
    <div className={classes.actionsDiv}>
      <TitleAndLike />
      <LikesViewsComments />
      <AvatarAndShare
        id={id}
        creatorProfilePicturePath={creatorProfilePicturePath}
        creatorUsername={creatorUsername}
        title={title}
      />
    </div>
  );
};

export default Actions;
