import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Typography, makeStyles } from '@material-ui/core';
import { CustomLoader, DeleteVideoIcon } from 'src/components';
import { Colors } from 'src/constants';
import clsx from 'clsx';
import UploadFileIcon from '@material-ui/icons/Upload';
import PropTypes from 'prop-types';
import FileModel from 'src/types/fileModel';
import { useSnackbar } from 'notistack';
import { getSrcFromBase64 } from 'src/utils/converter';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  button: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 400,
    height: 45,
    width: 120
  },
  dashedBorder: {
    border: '1px dashed',
    borderRadius: 8,
    borderColor: 'gray'
  },
  grayBg: {
    backgroundColor: 'rgba(228,228,228,0.25)',
  },
  video: {
    borderRadius: 5,
    height: '23vh'
  },
  videoRoot: {
    alignItems: 'center',
    display: 'block',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  middle: {
    transition: '.25s ease',
    opacity: 0,
    position: 'absolute',
    textAlign: 'center'
  },
  p: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 10
  },
  text: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
  wrapper: {
    textAlign: 'center'
  }
}));

const CustomVideoUpload = ({ base64Data, label, maxSeconds, mediaId = 0, setFileModel }) => {
  const classes = useStyles();
  const [fileData, setFileData] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFileData(base64Data);
  }, [base64Data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      const bufferFile = e.target.files[0];
      const fileModel: FileModel = {
        content: null,
        srcString: '',
        name: bufferFile.name,
        contentType: bufferFile.type,
        size: bufferFile.size
      };
      const reader = new FileReader();
      reader.readAsDataURL(bufferFile);
      reader.onload = () => {
        const result: string = reader.result as string;
        const split = result.split(',');
        const [, base64] = split;
        fileModel.content = base64;
        fileModel.srcString = getSrcFromBase64(fileModel.contentType, fileModel.content);
        setFileData(result);
        setFileModel(fileModel);

        const media = new Audio(result);
        media.onloadedmetadata = () => {
          if (maxSeconds > 0 && media.duration > maxSeconds) {
            enqueueSnackbar(`Video will be trimmed after uploaded! (${maxSeconds}s)`, { variant: 'warning' });
          }
        };
      };
    }
  };

  const fileWithData = () => (
    <div className={classes.videoRoot}>
      <video preload='metadata' src={fileData} autoPlay={false} className={classes.video} controls>
        Your browser does not support the video element.
        <track kind='captions' />
      </video>
      {mediaId > 0 && <DeleteVideoIcon mediaId={mediaId} />}
    </div>
  );

  const showFileOrInput = () => {
    if (fileData) {
      return fileWithData();
    }
    return (
      <>
        <Typography className={classes.p} variant='body1' color='primary'>
          Upload
          {' '}
          {label}
        </Typography>
        <Button component='label' startIcon={<UploadFileIcon style={{ fontSize: 15 }} />} className={classes.button} size='small' variant='contained'>
          Choose file
          <input accept='.mp4, .webm, .3gpp, .3gpp2, .flv, .mpeg' onChange={handleChange} type='file' hidden />
        </Button>
      </>
    );
  };

  const renderBody = () => {
    if (base64Data && !fileData) { return <CustomLoader />; }

    return (
      <div className={fileData ? classes.root : clsx(classes.root, classes.dashedBorder, classes.grayBg)}>
        <div className={classes.wrapper}>
          {showFileOrInput()}
        </div>
      </div>
    );
  };

  return renderBody();
};

CustomVideoUpload.propTypes = {
  base64Data: PropTypes.string,
  label: PropTypes.string.isRequired,
  mediaId: PropTypes.number,
  maxSeconds: PropTypes.number.isRequired,
  setFileModel: PropTypes.func
};

export default CustomVideoUpload;
