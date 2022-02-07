import { useEffect, useState, useRef, RefObject } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isIOS } from 'react-device-detect';
import AuthLayout from 'src/components/layouts/authLayout';

const useStyles = makeStyles({
  button: {
    height: 55
  },
  codeInput: {
    height: '100%',
    width: '90%',
    backgroundColor: '#FFF',
    border: '1px solid #A3A3A3',
    fontSize: isIOS ? '40px' : '3.5rem',
    textAlign: 'center',
    '&:focus': {
      border: '2px solid black',
    }
  },
  grayText: {
    color: '#A3A3A3',
    fontSize: 16,
    lineHeight: '22px'
  },
  subtitle: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '22px'
  },
});

type ValidateCodeFormProps = {
  submitAction: (code: string) => Promise<void>;
};

const ValidateCodeForm = ({ submitAction }: ValidateCodeFormProps) => {
  const classes = useStyles();
  const [code, setCode] = useState('');
  const firstInput: RefObject<HTMLInputElement> = useRef();
  const secondInput: RefObject<HTMLInputElement> = useRef();
  const thirdInput: RefObject<HTMLInputElement> = useRef();
  const fourthInput: RefObject<HTMLInputElement> = useRef();

  useEffect(() => {
    firstInput.current.focus();
  }, []);

  const getRef = (index: number) => {
    let ref = null;
    switch (index) {
      case 1:
        ref = firstInput;
        break;
      case 2:
        ref = secondInput;
        break;
      case 3:
        ref = thirdInput;
        break;
      case 4:
        ref = fourthInput;
        break;
      default:
        ref = null;
        break;
    }
    return ref;
  };

  const handleChange = async (value: string, index: number) => {
    setCode(`${code}${value}`);
    const ref = getRef(index + 1);
    if (ref !== null) {
      await new Promise((r) => setTimeout(r, 100));
      ref.current.focus();
    }
  };

  const handleOnKeyUp = async (e: any, index: number) => {
    if (e.keyCode === 8 || e.target.value === '') {
      const ref = getRef(index - 1);
      const updatedCode = code.slice(0, code.length - 1);
      setCode(updatedCode);
      if (ref !== null) {
        await new Promise((r) => setTimeout(r, 100));
        ref.current.focus();
      }
    } else if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1);
      e.preventDefault();
    } else handleChange(e.target.value, index);
  };

  const clearInputs = () => {
    firstInput.current.value = '';
    secondInput.current.value = '';
    thirdInput.current.value = '';
    fourthInput.current.value = '';
  };

  const handleSubmit = async () => {
    await submitAction(code);
    setCode('');
    clearInputs();
  };

  const renderInput = (pos: number) => {
    const ref = getRef(pos);
    return (
      <Grid item xs={3}>
        <input
          onWheel={(event) => { event.preventDefault(); }}
          ref={ref}
          type='number'
          onKeyUp={(e) => handleOnKeyUp(e, pos)}
          min={1}
          max={9}
          tabIndex={pos}
          className={classes.codeInput}
        />
      </Grid>
    );
  };

  return (
    <AuthLayout title='Validate your phone'>
      <Grid item xs={12}>
        <Typography className={classes.subtitle} variant='h2'>
          Enter the verification code
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.grayText} variant='h3'>
          We&apos;ve sent you a text message with a verification code.
        </Typography>
      </Grid>
      <Grid style={{ display: 'flex' }} item xs={12}>
        {renderInput(1)}
        {renderInput(2)}
        {renderInput(3)}
        {renderInput(4)}
      </Grid>
      <Grid item xs={12}>
        <Button className={classes.button} onClick={handleSubmit} variant='contained' color='primary' type='button'>Validate</Button>
      </Grid>
    </AuthLayout>
  );
};

export default ValidateCodeForm;
