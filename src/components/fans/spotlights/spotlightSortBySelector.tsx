import { ReactNode } from 'react';
import CustomSelect from 'src/components/custom/customSelect';
import SpotlightSortBy from '../../../types/fans/spotlights/spotlightSortBy';

type SpotlightSortBySelectorProps = {
  handleChange: (value: SpotlightSortBy) => void;
  value: SpotlightSortBy;
};

const SpotlightSortBySelector = ({ handleChange, value }: SpotlightSortBySelectorProps) => {
  const options: ReactNode[] = [
    <option key={SpotlightSortBy.DateUploaded} value={SpotlightSortBy.DateUploaded}>Date uploaded</option>,
    <option key={SpotlightSortBy.Likes} value={SpotlightSortBy.Likes}>Likes</option>,
    <option key={SpotlightSortBy.Views} value={SpotlightSortBy.Views}>Views</option>
  ];
  return <CustomSelect value={value} handleChange={(newValue) => handleChange(newValue)} options={options} />;
};

export default SpotlightSortBySelector;
