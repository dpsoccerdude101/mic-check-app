import { Grid, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { CustomLabel } from 'src/components';
import CustomAutocomplete from 'src/components/custom/customAutocomplete';
import { ApiRoutes } from 'src/constants';
import { TimePicker } from '@material-ui/lab';
import BandComboObj from 'src/types/band/bandComboObj';

import { useShowStore } from 'src/stores';
import { ShowBandDto } from 'src/types';

type LineupProps = {
  index: number,
  band: BandComboObj,
  startTime: Date,
  endTime: Date,
};

const ShowBand = ({ index, band, startTime, endTime }: LineupProps) => {
  const [selectedBand, setSelectedBand] = useState<BandComboObj>(band);
  const [selectedStartTime, setStartTime] = useState(startTime);
  const [selectedEndTime, setEndTime] = useState(endTime);
  const { updateLineup } = useShowStore((state) => ({ updateLineup: state.updateBandShow, lineups: state.bands }));

  const realTimeObj: ShowBandDto = {
    band: selectedBand,
    bandId: selectedBand?.id,
    startTime: selectedStartTime,
    endTime: selectedEndTime
  };

  useEffect(() => {
    if (selectedBand !== band || selectedStartTime !== startTime || selectedEndTime !== endTime) {
      updateLineup(realTimeObj, index);
    }
  }, [selectedBand, selectedStartTime, selectedEndTime]);

  return (
    <Grid item xs={12} sx={{ pb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}><CustomLabel bold={false} title='Band' /></Grid>
        <Grid item xs={12}>
          <CustomAutocomplete<BandComboObj>
            descriptionLabel={null}
            optionLabel='name'
            primaryLabel='name'
            setValue={(selected: any) => setSelectedBand(selected)}
            routeFunction={ApiRoutes.Bands.ListCombo}
            value={selectedBand}
          />
        </Grid>
        <Grid item xs={6}><CustomLabel bold={false} title='Start Time' /></Grid>
        <Grid item xs={6}><CustomLabel bold={false} title='End Time' /></Grid>
        <Grid item xs={6}>
          <TimePicker
            value={selectedStartTime}
            InputProps={{ name: 'time' }}
            InputAdornmentProps={{ position: 'start' }}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(props) => <TextField {...props} helperText={null} />}
          />
        </Grid>
        <Grid item xs={6}>
          <TimePicker
            value={selectedEndTime}
            InputProps={{ name: 'time' }}
            InputAdornmentProps={{ position: 'start' }}
            onChange={(newValue) => setEndTime(newValue)}
            renderInput={(props) => <TextField {...props} helperText={null} />}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShowBand;
