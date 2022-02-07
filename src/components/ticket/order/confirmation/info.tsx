import { ReactNode } from 'react';
import { Box, Typography } from '@material-ui/core';
import TicketOrderConfirmation from 'src/types/tickets/ticketOrderConfirmationInfo';
import { Formatter } from 'src/utils';
import GrayDivider from './grayDivider';

type InfoListProps = {
  info: TicketOrderConfirmation;
};

type InfoItemProps = {
  title: string;
  children?: ReactNode;
  [x: string]: any;
};

const InfoItem = (props: InfoItemProps) => {
  const { title, children, ...other } = props;
  return (
    <Box {...other}>
      <Typography component='div' color='grey' gutterBottom>
        {title}
      </Typography>
      <Typography component='span' color='primary' fontWeight='bold'>
        {children}
      </Typography>
    </Box>
  );
};

const Info = ({ info }: InfoListProps) => {
  const dayStr = Formatter.formatDateToDayOfWeek(info.showDate);
  const dateStr = Formatter.formatDateLiteral(info.showDate);
  const timeStr = Formatter.formatTime(info.showDate);
  return (
    <Box display='flex' flexDirection='column' width='100%'>
      <InfoItem title="You're going to" mb={3} mx={2}>
        {info.showName}
      </InfoItem>
      <InfoItem title='Date' mx={2}>
        {dayStr}
        ,
        {' '}
        {dateStr}
        <br />
        {timeStr}
      </InfoItem>
      <GrayDivider mt={2} mb={1} />
      <InfoItem title='Ticket sent to' mx={2}>
        {info.notifcationSentTo}
      </InfoItem>
    </Box>
  );
};

export default Info;
