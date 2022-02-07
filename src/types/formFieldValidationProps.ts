import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { FocusEventHandler } from 'react';

type FormFieldValidationProps = {
  isSubmitting: boolean;
  errors: FormikErrors<any>;
  handleBlur: FocusEventHandler;
  setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
  values: FormikValues;
  touched: FormikTouched<any>;
};

export default FormFieldValidationProps;
