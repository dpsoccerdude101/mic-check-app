import { Favorite, FavoriteBorder } from '@material-ui/icons';

type LikeIconProps = {
  liked: boolean;
};

const LikeIcon = ({ liked }: LikeIconProps) => (
  liked ? <Favorite /> : <FavoriteBorder />
);
export default LikeIcon;
