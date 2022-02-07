import { Grid, GridSize } from '@material-ui/core';
import type FormFieldValidationProps from 'src/types/formFieldValidationProps';
import CustomLabel from './customLabel';
import CustomFormTextField from './customFormTextField';

type CustomFormFieldProps = {
  className?: any;
  extraProps?: any;
  name: string;
  label: string;
  xs?: GridSize;
};

const FullLineFormField = (props: FormFieldValidationProps & CustomFormFieldProps) => {
  const { className = '', label, isSubmitting, name, errors, extraProps, handleBlur, setFieldValue, touched, values, xs = 12 } = props;
  return (
    <>
      <Grid item xs={xs} className={className}>
        <CustomLabel title={label} />
      </Grid>
      <Grid item xs={xs} className={className}>
        <CustomFormTextField
          showErrorMessage
          isSubmitting={isSubmitting}
          name={name}
          errors={errors}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          touched={touched}
          values={values}
          extraProps={extraProps}
        />
      </Grid>
    </>
  );
};

export default FullLineFormField;
