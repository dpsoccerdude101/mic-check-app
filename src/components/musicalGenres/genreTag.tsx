import { Colors } from 'src/constants';
import { CustomTag } from 'src/components';

type GenreTagProps = {
  title: string;
};

const GenreTag = ({ title }: GenreTagProps) => <CustomTag text={title} />;
export default GenreTag;
