import { FormFieldValidationProps } from 'src/types';
import CustomFormTextField from './custom/customFormTextField';

type EmailInputProps = {
  validationProps: FormFieldValidationProps
};

const EmailInput = ({ validationProps }: EmailInputProps) => (
  <CustomFormTextField
    customOnBlur={(e: any) => validationProps.setFieldValue('email', e.target.value.trim())}
    name='email'
    {...validationProps}
    extraProps={{ autoComplete: 'email' }}
  />
);

export default EmailInput;
