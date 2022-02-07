import { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, makeStyles, TextField, Typography, useMediaQuery } from '@material-ui/core';
import { DatePicker, TimePicker } from '@material-ui/lab';
import { CustomFileUpload, CustomLabel, CustomFormTextField } from 'src/components';
import { useRouter } from 'next/router';
import { ApiRoutes, TrackActions, UiRoutes } from 'src/constants';
import { useAuth } from 'src/hooks';
import api from 'src/utils/api';
import { LocationOn } from '@material-ui/icons';
import TrackService from 'src/services/trackService';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { URLExpression } from 'src/constants/expressions';
import { useShowStore, useTicketInfoStore } from 'src/stores';
import CustomHookFormTextField from 'src/components/custom/customHookFormTextField';
import type { Address, BaseResponse, FormFieldValidationProps, FileModel, Show } from 'src/types';
import BaseForm from '../../../forms/baseForm';
import Lineups from '../lineup';
import AdmissionDetails from '../admissionDetails';
import CustomAutocomplete from '../../../custom/customAutocomplete';
import ManagementTabsEnum from '../managementTabsEnum';

let initialValue: Show = {
  address: null,
  bandId: '',
  bands: [],
  creationTime: null,
  date: new Date(),
  endTime: null,
  minimumAge: 0,
  name: '',
  picture: null,
  ticketInfos: [],
  ticketLink: '',
  venueName: ''
};

const validationSchema = Yup
  .object()
  .shape({
    name: Yup
      .string()
      .max(150)
      .required('Name is required'),
    ticketUrl: Yup
      .string()
      .matches(URLExpression, 'Enter a valid url'),
    venueName: Yup
      .string()
      .max(150)
      .required('Venue name is required')
  });

type DetailsTabProps = {
  bandId: string;
  show?: Show;
};

const useStyles = makeStyles((theme) => ({
  uploadGrid: {
    [theme.breakpoints.down('lg')]: {
      height: '25.5vh'
    }
  },
  saveButton: {
    marginTop: theme.spacing(3),
    paddingTop: 11,
    paddingBottom: 14
  }
}));

const DetailsTab = ({ bandId, show }: DetailsTabProps) => {
  const [fileModel, setFileModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { setShowId } = useTicketInfoStore((state) => ({ setShowId: state.setShowId }));

  const {
    id, setId,
    address, setAddress,
    date, setDate,
    endTime, setEndTime,
    pictureId, setPictureId,
    bands, setBands,
    minimumAge, setMinimumAge,
    name, setName,
    startTime, setStartTime,
    description, setDescription,
    venueName, setVenueName,
    changeTab
  } = useShowStore((state) => (
    {
      address: state.address,
      date: state.date,
      description: state.description,
      id: state.id,
      startTime: state.startTime,
      endTime: state.endTime,
      bands: state.bands,
      minimumAge: state.minimumAge,
      name: state.name,
      pictureId: state.pictureId,
      venueName: state.venueName,
      setAddress: state.setAddress,
      changeTab: state.changeTab,
      setDate: state.setDate,
      setDescription: state.setDescription,
      setEndTime: state.setEndTime,
      setId: state.setId,
      setBands: state.setBands,
      setMinimumAge: state.setMinimumAge,
      setName: state.setName,
      setStartTime: state.setStartTime,
      setPictureId: state.setPictureId,
      setVenueName: state.setVenueName
    }
  ));

  const updateStoreIfNeeded = () => {
    if (!name) { setName(show.name); }
    if (!description) { setDescription(show.description); }
    if (!venueName) { setVenueName(show.venueName); }
    if (bands.length === 0) { setBands(show.bands); }
    if (!address) { setAddress(show.address); }
    if (!date) {
      const showDate = new Date(show.date);
      setDate(showDate);
      setStartTime(new Date(showDate.getTime()));
    }
    if (!minimumAge) { setMinimumAge(show.minimumAge); }
    if (show.endTime) {
      const showEndTime = new Date(show.endTime);
      setEndTime(new Date(showEndTime.getTime()));
    }
  };

  initialValue = {
    bandId: show?.bandId,
    ticketLink: show?.ticketLink,
    ticketInfos: show?.ticketInfos,
    pictureId: show?.pictureId,
    picture: show?.picture,
    name,
    address,
    date,
    endTime,
    bands,
    minimumAge,
    description,
    venueName
  };

  useEffect(() => {
    async function renderShowImage(imageId) {
      const imageFileModel: FileModel = {
        srcString: ApiRoutes.Files.GetFile(imageId)
      };
      setFileModel(imageFileModel);
    }

    async function renderBandPictureAsDefault() {
      const imageFileModel: FileModel = {
        srcString: ApiRoutes.Files.GetBandPicture(bandId)
      };
      setFileModel(imageFileModel);
    }

    if (show) {
      renderShowImage(show.pictureId);
      updateStoreIfNeeded();
    } else if (pictureId) {
      renderShowImage(pictureId);
    } else {
      renderBandPictureAsDefault();
    }
  }, []);

  useEffect(() => {
    if (show && startTime && new Date(startTime).getTime() !== new Date(show.date).getTime()) {
      const newDate = new Date(startTime.valueOf());
      newDate.setTime(newDate.getTime() + (1 * 60 * 60 * 1000));
      setEndTime(newDate);
    }
  }, [startTime]);

  const renderAutocomplete = () => (
    <CustomAutocomplete<Address>
      allowOnlyInput
      descriptionLabel='secondary'
      Icon={LocationOn}
      setValue={(selected: Address) => setAddress(selected)}
      value={address}
      optionLabel='formatted'
      primaryLabel='principal'
      routeFunction={ApiRoutes.Address.GetLocation}
    />
  );

  const renderBasicShowInfo = (validationProps) => (
    <>
      <Grid item xs={12} md={8} lg={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}><CustomLabel bold={false} title='Show Name' /></Grid>
          <Grid item xs={12}>
            <CustomHookFormTextField
              {...validationProps}
              name='name'
              updateValue={setName}
            />
          </Grid>
          <Grid item xs={12}><CustomLabel bold={false} title='Date' /></Grid>
          <Grid item xs={12}>
            <DatePicker
              value={date}
              views={['day']}
              onChange={(newValue) => setDate(newValue)}
              minDate={new Date()}
              InputProps={{ name: 'date' }}
              InputAdornmentProps={{ position: 'start' }}
              renderInput={(props) => <TextField {...props} helperText={null} />}
            />
          </Grid>
          <Grid item xs={6}><CustomLabel bold={false} title='Start Time' /></Grid>
          <Grid item xs={6}><CustomLabel bold={false} title='End Time' /></Grid>
          <Grid item xs={6}>
            <TimePicker
              value={startTime}
              InputProps={{ name: 'startTime' }}
              InputAdornmentProps={{ position: 'start' }}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(props) => <TextField {...props} helperText={null} />}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              value={endTime}
              InputProps={{ name: 'endTime' }}
              InputAdornmentProps={{ position: 'start' }}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(props) => <TextField {...props} helperText={null} />}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{ display: { xs: 'none', md: 'block' } }} item md={4} />
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}><CustomLabel bold={false} title='Description' /></Grid>
          <Grid item xs={12}>
            <CustomHookFormTextField
              {...validationProps}
              name='description'
              extraProps={{ multiline: true, rows: 4 }}
              updateValue={setDescription}
            />
          </Grid>
          <Grid item xs={12}><CustomLabel bold={false} title='Venue Name' /></Grid>
          <Grid item xs={12}>
            <CustomHookFormTextField
              {...validationProps}
              name='venueName'
              updateValue={setVenueName}
            />
          </Grid>
          <Grid item xs={12}><CustomLabel bold={false} title='Venue Address' /></Grid>
          <Grid item xs={12}>
            {renderAutocomplete()}
          </Grid>
          <Grid item xs={12}><CustomLabel bold={false} title='Ticket Link' /></Grid>
          <Grid item xs={12}>
            <CustomFormTextField
              {...validationProps}
              name='ticketLink'
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );

  const loadFileModel = (file: FileModel) => {
    setFileModel(file);
  };

  const normalizeLineupDates = (values: Show) => {
    const getLineupDay = (showDate: Date, bandShowDate: Date): number => {
      const showBandHours = bandShowDate.getHours();
      if (showBandHours > 4) return showDate.getDate();
      return showDate.getDate() + 1;
    };

    const ensureDate = (dt: Date | string): Date => {
      if (typeof (dt) === 'string') { return new Date(dt); }

      return dt;
    };

    const normalizeEndTime = (start: Date, end: Date) => {
      if (
        (start.getHours() > end.getHours() && start.getDate() === end.getDate())
        || start.getDate() > end.getDate()
      ) {
        end.setDate(end.getDate() + 1);
      }
    };

    values.bands.forEach((band) => {
      band.startTime = ensureDate(band.startTime);
      let bandShowDay = getLineupDay(date, band.startTime);
      band.startTime.setDate(bandShowDay);

      band.endTime = ensureDate(band.endTime);
      bandShowDay = getLineupDay(date, band.endTime);
      band.endTime.setDate(bandShowDay);
      normalizeEndTime(band.startTime, band.endTime);
    });
  };

  const prepareObj = (values: Show): Show => {
    date.setHours(startTime.getHours());
    date.setMinutes(startTime.getMinutes());
    date.setSeconds(0);
    values.address = address;
    values.addressId = address ? address.id : 0;
    values.date = date;
    values.bands = bands;
    if (values.bands) {
      normalizeLineupDates(values);
    }
    if (endTime) {
      endTime.setMonth(date.getMonth());
      endTime.setFullYear(date.getFullYear());
      if (endTime.getHours() < startTime.getHours()) {
        endTime.setDate(date.getDate() + 1);
      } else {
        endTime.setDate(date.getDate());
      }
    }
    values.endTime = endTime;
    values.picture = fileModel;
    values.bandId = bandId;
    values.minimumAge = minimumAge;
    if (id) { values.id = id; }

    return values;
  };

  const submitShow = async (values: Show) => {
    values = prepareObj(values);
    let response: BaseResponse<Show> = null;
    setLoading(true);
    response = id ? await api.put(ApiRoutes.Shows.Update, values) : await api.post(ApiRoutes.Shows.Add, values);

    if (response.success && response.data.id) {
      // Track if user is creating show
      const bandNameResponse: BaseResponse<string> = await api.get(ApiRoutes.Bands.GetName(response.data.bandId));
      const trackPayload = {
        showName: response.data.name,
        showDate: response.data.date,
        showVenueName: response.data.venueName,
        showVenueAddress: response.data.address?.formatted,
        bandName: bandNameResponse.data
      };
      if (!show) {
        TrackService.trackAction(TrackActions.BAND_CREATED_SHOW, trackPayload, user);
      } else {
        TrackService.trackAction(TrackActions.BAND_EDITED_SHOW, trackPayload, user);
      }
      if (user.isAdmin) {
        setId(response.data.id);
        setShowId(response.data.id);
        setPictureId(response.data.pictureId);
        changeTab(ManagementTabsEnum.TicketManagement);
      } else {
        router.push(UiRoutes.MyBand.Shows.List(bandId));
      }
    } else if (response.message) { enqueueSnackbar(response.message, { variant: 'error' }); }
    setLoading(false);
  };

  const isXs = useMediaQuery((theme: any) => theme.breakpoints.only('xs'));

  return (
    <BaseForm<Show>
      submitFunc={submitShow}
      initialValue={initialValue}
      validationSchema={validationSchema}
      validateOnChange={false}
    >
      {(validationProps: FormFieldValidationProps) => {
        const { isSubmitting } = validationProps;
        return (
          <Grid sx={{ pb: 2 }} container spacing={3} direction='row' alignItems='stretch'>
            {!isXs && <Grid item md={4} sx={{ pt: '0 !important' }} />}
            <Grid item xs={12} md={8} sx={{ pt: '0 !important' }}>
              <Typography variant='h2'>Show Details</Typography>
            </Grid>
            <Grid className={classes.uploadGrid} item xs={12} md={4} lg={4}>
              <Grid style={{ height: '100%' }}>
                <CustomFileUpload label='Show Picture' imgSrc={fileModel ? fileModel.srcString : ''} setFileModel={loadFileModel} />
              </Grid>
            </Grid>

            {renderBasicShowInfo(validationProps)}
            <Grid sx={{ display: { xs: 'none', md: 'block' } }} item md={4} />
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {
                  user.isAdmin
                  && (
                    <>
                      <Lineups isSubmitting={isSubmitting} />
                      <AdmissionDetails />
                    </>
                  )
                }
                <Grid item xs={6} md={4} lg={3} style={{ textAlign: 'right' }}>
                  <Button
                    disabled={isSubmitting}
                    type='submit'
                    size='large'
                    variant='contained'
                    className={classes.saveButton}
                    fullWidth
                  >
                    Save Changes

                    {isSubmitting || loading ? <CircularProgress size='small' /> : null}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    </BaseForm>
  );
};

export default DetailsTab;
