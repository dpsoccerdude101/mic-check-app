import { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import formatter from 'src/utils/formatter';
import PropTypes from 'prop-types';

type ShowDateTimeProps = {
  date: any,
  spaceBetween?: number
};

const ShowDateTime = ({ date, spaceBetween }: ShowDateTimeProps) => {
  const [dateString, setDateString] = useState('');
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    if (date) {
      const dtObj = new Date(date);
      setDateString(formatter.formatDateToString(dtObj));
      setTimeString(formatter.formatTime(dtObj));
    }
  }, []);
  return (
    <div>
      <Typography variant='h3' mb={0.5}>
        {dateString}, {timeString}
      </Typography>
    </div>
  );
};

ShowDateTime.propTypes = {
  date: PropTypes.any.isRequired,
  spaceBetween: PropTypes.number
};

export default ShowDateTime;
