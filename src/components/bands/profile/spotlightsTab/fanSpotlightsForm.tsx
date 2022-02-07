import { useState, useEffect } from 'react';
import { Button, Grid, Typography, MenuItem, FormControl, Select, InputLabel, OutlinedInput, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useSpotlights, useAuth } from 'src/hooks';
import { CustomLoader, CustomVideoUpload, ShowSelectItem, ShowsSortBy } from 'src/components';
import {
  BaseResponse,
  FanSpotlightRequest,
  FanSpotlightDto, FileModel, Show, ShowsFilter, ShowsQueryRequest
} from 'src/types';
import ShowsService from 'src/services/showsService';
import { Api } from 'src/utils';
import { ApiRoutes, Colors, TrackActions } from 'src/constants';
import TrackService from 'src/services/trackService';

const useStyles = makeStyles({
  showInformation: {
    paddingTop: 25
  },
  video: {
    height: '25vh'
  },
  notchedOutline: {
    '& legend': {
      maxWidth: 1000
    }
  },
  loaderWrapper: {
    zIndex: 9999,
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: Colors.COLOR_5,
    opacity: '.9'
  }
});

type FanSpotlightsFormProps = {
  bandName: string;
  bandId: string;
  handleAdd: () => void;
};

const FanSpotlightsForm = ({ bandName, bandId, handleAdd }: FanSpotlightsFormProps) => {
  const classes = useStyles();
  const { addSpotlight } = useSpotlights();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showList, setShowList] = useState<Show[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<string>('');
  const [spotlightMedia, setMedia] = useState<FileModel>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadShowList = async () => {
      const request: ShowsQueryRequest = {
        bandId,
        filter: ShowsFilter.PastAndCurrent,
        maxResultCount: 5,
        skipCount: 0,
        sorting: ShowsSortBy.DateDesc
      };
      const response = await ShowsService.getFromBand(request);
      const { data, message, success } = response;
      if (success) {
        setShowList(data.items);
        if (data.items.length > 0) { setSelectedShowId(data.items[0].id); }
      } else {
        enqueueSnackbar(message, { variant: 'error' });
      }
    };

    loadShowList();
  }, [bandId]);

  const handleUpload = (fileModel: FileModel) => {
    setMedia(fileModel);
  };

  const handleSubmit = async () => {
    const { fanId } = user;
    if (!fanId) {
      enqueueSnackbar('Only fans can upload spotlight!', { variant: 'error' });
      return;
    }
    setIsSubmitting(true);
    const request: FanSpotlightRequest = {
      fanId,
      bandId,
      showId: selectedShowId !== '' ? selectedShowId : null,
      mediaFile: {
        content: spotlightMedia.content,
        contentType: spotlightMedia.contentType,
        name: spotlightMedia.name,
        size: spotlightMedia.size,
        srcString: null
      }
    };

    const response: BaseResponse<FanSpotlightDto> = await Api.post(ApiRoutes.FansSpotlights.AddNew, request);
    const { data, message, success } = response;
    if (success) {
      addSpotlight(data);
      handleAdd();
      const { band, show, title } = data;
      const trackPayload = {
        bandName: band.name,
        showName: show ? show.name : '',
        title
      };
      TrackService.trackAction(TrackActions.USER_UPLOADED_SPOTLIGHT, trackPayload, user);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
      setMedia(null);
    }
    setIsSubmitting(false);
  };

  const renderSelect = () => {
    let baseOptions = [
      <MenuItem key='no-show' value=''>No show</MenuItem>
    ];

    if (showList.length > 0) {
      const showOptions = showList
        .map((el) => <MenuItem value={el.id} key={el.id}><ShowSelectItem show={el} /></MenuItem>);
      baseOptions = baseOptions.concat(showOptions);
    }
    const selectLabel = selectedShowId ? 'Selected show' : 'Select a show';
    return (
      <FormControl fullWidth>
        <InputLabel shrink id='show-select-label'>{selectLabel}</InputLabel>
        <Select
          disabled={isSubmitting}
          displayEmpty
          labelId='show-select-label'
          id='show-select'
          value={selectedShowId}
          input={(
            <OutlinedInput
              label={selectLabel}
              classes={{
                notchedOutline: classes.notchedOutline
              }}
            />
          )}
          onChange={(e) => { setSelectedShowId(e.target.value); }}
        >
          {baseOptions}
        </Select>
      </FormControl>
    );
  };

  const buttonDisabled = spotlightMedia === null;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}><Typography variant='h2'>{`Upload Spotlight for ${bandName}`}</Typography></Grid>
        <Grid className={classes.video} item xs={12}>
          <CustomVideoUpload base64Data={spotlightMedia ? spotlightMedia.srcString : null} label='Video' maxSeconds={30} setFileModel={handleUpload} />
        </Grid>
        <Grid className={classes.showInformation} item xs={12}><Typography variant='h2'>Show Information</Typography></Grid>
        <Grid item xs={12}>{renderSelect()}</Grid>
        <Grid item xs={12}>
          <Button
            disabled={buttonDisabled || isSubmitting}
            onClick={handleSubmit}
            variant='contained'
            color='primary'
          >
            Upload Spotlight

          </Button>

        </Grid>
      </Grid>
      {isSubmitting && <div className={classes.loaderWrapper}><CustomLoader /></div>}
    </>
  );
};

export default FanSpotlightsForm;
