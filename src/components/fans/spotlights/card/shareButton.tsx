import { Share } from '@material-ui/icons';
import ButtonIcon from './cardIcon';
import CardButton from './cardButton';

const ShareButton = () => {
  const handleClick = () => { };
  const ShareIcon = <ButtonIcon Icon={Share} />;
  return <CardButton disabled handleClick={handleClick} startIcon={ShareIcon} text='Share' />;
};

export default ShareButton;
