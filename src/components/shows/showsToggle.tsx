import { ToggleButtonGroup, ToggleButton } from '@material-ui/core';
import { ShowsFilter } from 'src/types';

type ShowsToggleProps = {
  handleChange: (value: ShowsFilter) => void;
  value: ShowsFilter;
};

const ShowsToggle = ({ value, handleChange }: ShowsToggleProps) => (
  <ToggleButtonGroup value={value} onChange={(e, newValue) => handleChange(newValue)} exclusive aria-label='Shows Filter'>
    <ToggleButton value={ShowsFilter.Upcoming} aria-label='Upcoming shows'>Upcoming</ToggleButton>
    <ToggleButton value={ShowsFilter.Past} aria-label='Past shows'>Past</ToggleButton>
  </ToggleButtonGroup>
);

export default ShowsToggle;
