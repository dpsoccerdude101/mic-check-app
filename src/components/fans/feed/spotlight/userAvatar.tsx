import { Avatar, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  }
}));

type UserAvatarProps = {
  src: string;
};

const UserAvatar = ({ src }: UserAvatarProps) => {
  const classes = useStyles();

  return <Avatar alt='profile' className={classes.avatar} src={src} sx={{ mr: 1 }} />;
};

export default UserAvatar;
