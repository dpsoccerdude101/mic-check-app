import { TextField } from '@material-ui/core';
import type FormFieldValidationProps from 'src/types/formFieldValidationProps';

type CustomHookFormInputProp = {
  name: string;
  updateValue: (value: any) => void;
  extraProps?: any;
  showErrorMessage?: boolean;
  value?: any;
};

const CustomHookFormTextField = (props: FormFieldValidationProps & CustomHookFormInputProp) => {
  const {
    isSubmitting, name, errors,
    extraProps, handleBlur, setFieldValue,
    updateValue, showErrorMessage = false, touched,
    value, values
  } = props;
  return (
    <TextField
      disabled={isSubmitting}
      error={Boolean(errors[name] && touched[name])}
      helperText={touched[name] && showErrorMessage && errors[name]}
      onBlur={handleBlur}
      onChange={(e) => {
        setFieldValue(name, e.target.value);
        updateValue(e.target.value);
      }}
      value={value || values[name]}
      name={name}
      id={name}
      type='text'
      label=''
      {...extraProps}
    />
  );
};

export default CustomHookFormTextField;
