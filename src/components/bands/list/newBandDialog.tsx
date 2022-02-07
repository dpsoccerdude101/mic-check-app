import { useState } from 'react';
import { useBandAdmin, useDataTable } from 'src/hooks';
import { CustomDialog, CustomLabel } from 'src/components';
import { Grid, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import type { Band, BandRegisterModel, BaseResponse } from 'src/types';

const NewBandDialog = () => {
  const { addBand, setShowAddBandDialog, showAddBandDialog } = useBandAdmin();
  const [name, setBandName] = useState('');
  const [email, setBandEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { setReloadGrid } = useDataTable();

  const saveBand = async () => {
    const band: BandRegisterModel = { name, email };
    const response: BaseResponse<Band> = await addBand(band);
    const { success, message } = response;
    if (success) {
      setShowAddBandDialog(false);
      clearFields();
      setReloadGrid(true);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const clearFields = () => {
    setBandName('');
    setBandEmail('');
  };

  return (
      <CustomDialog
        open={showAddBandDialog}
        title='Create a new band'
        text=''
        closeDialogFunc={async () => {
          setShowAddBandDialog(false);
          clearFields();
        }}
        cancelText='Cancel'
        submitText='Create'
        submitHandler={async () => saveBand()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}><CustomLabel title='Band Name' /></Grid>
          <Grid item xs={12}>
            <TextField value={name} onChange={(e) => { setBandName(e.target.value); }} />
          </Grid>
          <Grid item xs={12}><CustomLabel title='First member email (optional)' /></Grid>
          <Grid item xs={12}><TextField value={email} onChange={(e) => setBandEmail(e.target.value)} /></Grid>
        </Grid>
      </CustomDialog>
  );
};

export default NewBandDialog;
