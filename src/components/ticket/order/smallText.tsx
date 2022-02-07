import { Typography } from '@material-ui/core';

type SmallTextProps = {
  text: string;
};
const SmallText = ({ text }: SmallTextProps) => (<Typography variant='h3' color='primary' fontWeight={400}>{text}</Typography>);

export default SmallText;
