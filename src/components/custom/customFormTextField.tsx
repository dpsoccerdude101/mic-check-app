import { TextField } from '@material-ui/core';
import { FocusEvent } from 'react';
import type FormFieldValidationProps from 'src/types/formFieldValidationProps';
import Helper from 'src/utils/helper';

type CustomFormInputProp = {
  name: string;
  customOnBlur?: (e: FocusEvent<Element>) => void;
  extraProps?: any;
  showErrorMessage?: boolean;
};

const CustomFormTextField = (props: FormFieldValidationProps & CustomFormInputProp) => {
  const { customOnBlur, isSubmitting, name, errors, extraProps, handleBlur, setFieldValue, touched, showErrorMessage = false, values } = props;
  const handleOnBlur = customOnBlur ? async (e: FocusEvent<Element>) => {
    customOnBlur(e);
    await Helper.wait(1);
    handleBlur(e);
  } : handleBlur;
  return (
    <TextField
      disabled={isSubmitting}
      error={Boolean(errors[name] && touched[name])}
      helperText={touched[name] && showErrorMessage && errors[name]}
      onBlur={handleOnBlur}
      onChange={(e) => setFieldValue(name, e.target.value)}
      value={values[name]}
      name={name}
      id={name}
      type='text'
      label=''
      {...extraProps}
    />
  );
};

export default CustomFormTextField;
