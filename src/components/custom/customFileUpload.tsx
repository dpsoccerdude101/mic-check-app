import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Typography, makeStyles } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { Colors } from 'src/constants';
import clsx from 'clsx';
import UploadFileIcon from '@material-ui/icons/Upload';
import PropTypes from 'prop-types';
import FileModel from 'src/types/fileModel';
import { getSrcFromBase64 } from 'src/utils/converter';

const useStyles = makeStyles((theme) => ({
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
  img: {
    borderRadius: 10,
    height: 200,
    [theme.breakpoints.down('lg')]: {
      height: 150
    }
  },
  imgRoot: {
    alignItems: 'center',
    display: 'flex',
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

const CustomFileUpload = ({ imgSrc, label, setFileModel }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [fileData, setFileData] = useState('');
  const [isHover, setHover] = useState(false);

  useEffect(() => {
    if (imgSrc && !fileData) {
      setFileData(imgSrc);
    }
  }, [imgSrc]);

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

        // Convert file to be displayed on img tag
        fileModel.srcString = getSrcFromBase64(fileModel.contentType, fileModel.content);
        setFileData(result);
        setFileModel(fileModel);
      };
    }
  };

  const fileWithData = () => (
    <div className={classes.imgRoot} onFocus={() => { }} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} onBlur={() => { }}>
      <img
        onLoad={() => setLoaded(true)}
        onError={() => { setFileData(null); }}
        className={clsx(classes.img, classes.dashedBorder)}
        style={{ display: loaded ? 'block' : 'none', opacity: isHover ? '0.3' : 1 }}
        alt={label}
        src={fileData}
      />
      <div className={classes.middle} style={{ opacity: isHover ? 1 : 0 }}>
        <Button
          component='label'
          variant='contained'
          color='primary'
          size='small'
          startIcon={<CloudUpload />}
          fullWidth
        >
          Switch photo
          <input accept='image/*' onChange={handleChange} type='file' hidden />
        </Button>
      </div>
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
        <Button
          component='label'
          startIcon={<UploadFileIcon style={{ fontSize: 15 }} />}
          className={classes.button}
          size='small'
          variant='contained'
          fullWidth
        >
          Choose file
          <input accept='image/*' onChange={handleChange} type='file' hidden />
        </Button>
      </>
    );
  };

  return (
    <div className={fileData ? classes.root : clsx(classes.root, classes.dashedBorder, classes.grayBg)}>
      <div className={classes.wrapper}>
        {showFileOrInput()}
      </div>
    </div>
  );
};

CustomFileUpload.propTypes = {
  imgSrc: PropTypes.string,
  label: PropTypes.string.isRequired,
  setFileModel: PropTypes.func,
};

export default CustomFileUpload;
