import { IconButton, Typography, Fade, makeStyles } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';
import { useSearch } from 'src/hooks';

import { useRouter } from 'next/router';
import { Colors, UiRoutes } from 'src/constants';
import CustomImage from 'src/components/custom/customImage';

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
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20
  },
  wrapper: {
    borderRadius: 15,
    cursor: 'pointer',
    display: 'inline-flex',
    marginBottom: 20,
    paddingRight: 15,
    width: '100%',
    '&:hover': {
      backgroundColor: Colors.SECONDARY
    }
  }
});

type BandListItemProps = {
  id: string;
  name: string;
  imgSrc: string;
  index: number;
};

const BandSearchItem = ({ imgSrc, name, id, index }: BandListItemProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { closeSearch } = useSearch();

  const handleClick = async () => {
    await router.push(UiRoutes.Bands.Profile(id));
    closeSearch();
  };
  return (
    <Fade in timeout={600 * index}>
      <div role='none' className={classes.wrapper} onClick={handleClick}>
        <div className={classes.imgWrapper}>
          <CustomImage className={classes.img} imgSrc={imgSrc} title={name} />
        </div>
        <div className={classes.innerWrapper}>
          <Typography variant='h2'>{name}</Typography>
          <IconButton edge='end'>
            <ArrowForwardIos className={classes.icon} fontSize='small' />
          </IconButton>
        </div>
      </div>
    </Fade>
  );
};

export default BandSearchItem;
