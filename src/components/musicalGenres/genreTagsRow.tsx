import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import GenreTag from './genreTag';

type GenreTagsRowProps = {
  genres: string[] | null,
  paddingTop?: number
};

const GenreTagsRow = ({ genres, paddingTop }: GenreTagsRowProps): JSX.Element => {
  if (!genres) { return null; }

  const total = genres.length;
  if (total === 0) {
    return <GenreTag title='No genre' />;
  }

  // Displaying only 2 items
  if (total > 3) { genres = genres.slice(0, 2); }
  const toReturnElements = genres.map((el) => <GenreTag title={el} key={el} />);
  return <>{toReturnElements}</>;
};

GenreTagsRow.propTypes = {
  genres: PropTypes.any,
  paddingTop: PropTypes.number
};

export default GenreTagsRow;
