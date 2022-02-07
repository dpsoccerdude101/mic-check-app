import { ReactNode } from 'react';
import ShowsSortBy from './showSortBy';
import CustomSelect from '../custom/customSelect';

type ShowsSortBySelectorProps = {
  handleChange: (value: ShowsSortBy) => void;
  value: ShowsSortBy;
};

const ShowsSortBySelector = ({ handleChange, value }: ShowsSortBySelectorProps) => {
  const options: ReactNode[] = [
    <option key={ShowsSortBy.Date} value={ShowsSortBy.Date}>Show date</option>,
    <option key={ShowsSortBy.CreationTime} value={ShowsSortBy.CreationTime}>Date uploaded</option>
  ];
  return <CustomSelect value={value} handleChange={(newValue) => handleChange(newValue)} options={options} />;
};

export default ShowsSortBySelector;
