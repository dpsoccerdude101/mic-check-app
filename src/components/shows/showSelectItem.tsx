import { useState, useEffect } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import formatter from 'src/utils/formatter';
import { ApiRoutes, Colors } from 'src/constants';
import CustomImage from 'src/components/custom/customImage';
import { Show } from 'src/types';

const useStyles = makeStyles({
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10%'
  },
  icon: {
    fontSize: '.8rem'
  },
  imgWrapper: { width: 150, height: 95 },
  innerWrapper: {
    width: '100%',
    paddingLeft: 15
  },
  title: {
    fontSize: '.7rem',
    whiteSpace: 'normal',
    paddingBottom: 10
  },
  date: {
    fontSize: '.7rem'
  },
  root: {
    cursor: 'pointer',
    display: 'flex',
    '&:hover': {
      backgroundColor: Colors.SECONDARY
    }
  }
});

type ShowSelectItemProps = {
  show: Show,
};

const ShowSelectItem = ({ show }: ShowSelectItemProps) => {
  const classes = useStyles();
  const { pictureId, name, date } = show;
  const [dateStr, setDateStr] = useState('');
  const [imageData, setImageData] = useState('');

  useEffect(() => {
    async function renderImage() {
      const srcString = ApiRoutes.Files.GetFile(pictureId);
      setImageData(srcString);
    }
    if (date) {
      const dtObj = new Date(date);
      setDateStr(formatter.formatDate(dtObj));
    }

    renderImage();
  }, [show]);

  return (
    <div className={classes.root}>
      <div className={classes.imgWrapper}>
        <CustomImage className={classes.img} imgSrc={imageData} title={name} />
      </div>
      <div className={classes.innerWrapper}>
        <Typography className={classes.title} variant='h2' color='primary'>{name}</Typography>
        <Typography className={classes.date} variant='body1'>
          {dateStr}
        </Typography>
      </div>
    </div>
  );
};

export default ShowSelectItem;
