import {
  Alert, List
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Show, ShowsFilter } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
import ShowListItem from './showListItem';

type ShowListProps = {
  items: Show[],
  filter?: ShowsFilter,
  bandId?: string
};

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
});

const ShowList = ({ bandId, filter, items }: ShowListProps): JSX.Element => {
  const classes = useStyles();
  const isPast = filter && filter === ShowsFilter.Past;
  if (!items || items.length === 0) {
    return (
      <Alert variant='outlined' severity='info'>
        No
        {' '}
        {filter === ShowsFilter.Upcoming ? 'upcoming' : 'past'}
        {' '}
        shows.
      </Alert>
    );
  }

  return (
    <>
      <List className={classes.root}>
        {items.map((show) => <ShowListItem key={uuidv4()} show={show} bandId={bandId} isPast={isPast} />)}
      </List>
    </>
  );
};

export default ShowList;
