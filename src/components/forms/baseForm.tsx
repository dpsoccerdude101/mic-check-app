import { Formik } from 'formik';
import PropTypes from 'prop-types';
import type FormValidationProps from 'src/types/formFieldValidationProps';

type BaseFormProps<T> = {
    children: (props: FormValidationProps) => JSX.Element;
    initialValue: T;
    submitFunc: (values: T) => Promise<void>;
    validationSchema: any;
    validateOnChange?: boolean;
};

const BaseForm = <T,>(props: BaseFormProps<T>) => {
    const {
        children,
        initialValue,
        submitFunc,
        validationSchema,
        validateOnChange = true,
    } = props;
    return (
        <Formik
            enableReinitialize
            validateOnChange={validateOnChange}
            initialValues={{ ...initialValue }}
            validationSchema={validationSchema}
            onSubmit={async (
                values,
                { setStatus, setSubmitting }
            ): Promise<void> => {
                try {
                    await submitFunc(values);
                } catch (err) {
                    console.log('Error!', err);
                    setStatus({ success: false });
                    setSubmitting(false);
                }
            }}
        >
            {({
                errors,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                touched,
                values,
            }) => {
                const validationProps: FormValidationProps = {
                    isSubmitting,
                    errors,
                    handleBlur,
                    setFieldValue,
                    touched,
                    values,
                };
                return (
                    <form noValidate onSubmit={handleSubmit}>
                        {children(validationProps)}
                    </form>
                );
            }}
        </Formik>
    );
};

BaseForm.propTypes = {
    children: PropTypes.any.isRequired,
    initialValue: PropTypes.any.isRequired,
    submitFunc: PropTypes.func.isRequired,
    validationSchema: PropTypes.any.isRequired,
};

export default BaseForm;
