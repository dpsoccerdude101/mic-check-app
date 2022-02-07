import { Box, Typography } from '@material-ui/core';
import { Formatter } from 'src/utils';
import { useTicketInstanceStore } from 'src/stores';
import Dot from './dot';
import SmallText from './smallText';

const ShowInfo = () => {
  const { date, name } = useTicketInstanceStore((state) => ({
    date: state.show.date,
    name: state.show.name,
  }));
  const dayStr = Formatter.formatDateToDayOfWeek(date);
  const dateStr = Formatter.formatDateLiteral(date);
  const timeStr = Formatter.formatTime(date);

  return (
    <>
      <Box
        display='flex'
        alignItems='flex-start'
        flexDirection='column'
        justifyContent='spaceAround'
      >
        <Typography variant='h2' color='primary'>
          {name}
        </Typography>
        <Box
          display='inline-flex'
          alignContent='center'
          alignItems='center'
        >
          <SmallText text={dayStr} />
          <Dot />
          <SmallText text={dateStr} />
          <Dot />
          <SmallText text={timeStr} />
        </Box>
      </Box>
    </>
  );
};

export default ShowInfo;
