import { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { BaseForm, CustomHookFormTextField, CustomLabel } from 'src/components';
import { DateTimePicker } from '@material-ui/lab';
import * as Yup from 'yup';
import { BaseResponse, FormFieldValidationProps, TicketInfo } from 'src/types';
import clsx from 'clsx';
import { useShowStore, useTicketInfoStore, useTicketInstanceStore } from 'src/stores';
import { TicketService } from 'src/services';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
    name: Yup.string().required(),
    maximumPerUser: Yup.number().min(1),
    maximumCapacity: Yup.number().min(1),
});

const useStyles = makeStyles({
    button: {
        height: '3rem',
        '&.not-selected': {
            borderColor: '#E5E5E5',
        },
    },
});

enum PriceTypes {
    Paid = 'PAID',
    Free = 'FREE',
}

const TicketForm = () => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { id: showId, showEndTime } = useShowStore((state) => ({
        id: state.id,
        showEndTime: state.endTime,
    }));
    const {
        id,
        addTicket,
        updateTicket,
        hideTicketForm,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        name,
        setName,
        note,
        setNote,
        price,
        setPrice,
        maximumCapacity,
        setMaximumCapacity,
        maximumPerUser,
        setMaximumPerUser,
    } = useTicketInfoStore((state) => state);
    const [priceType, setPriceType] = useState<PriceTypes>(PriceTypes.Free);
    const { updateShowTicketInfo } = useTicketInstanceStore((state) => ({ 
        updateShowTicketInfo: state.updateShowTicketInfo 
    }));

    useEffect(() => {
        console.log('ticketForm: price', price);
        setPriceType(price === 0 ? PriceTypes.Free : PriceTypes.Paid);
    }, [price]);

    const initialValue: TicketInfo = {
        showId,
        price,
        startDate,
        endDate: endDate < showEndTime ? showEndTime : endDate,
        maximumCapacity,
        maximumPerUser,
        name,
        note,
    };

    const saveTicket = async (value: TicketInfo) => {
        let response: BaseResponse<TicketInfo>;
        const isUpdate = id;
        if (isUpdate) {
            value.id = id;
            response = await TicketService.updateTicketInfo(value);
        } else {
            response = await TicketService.addTicketInfo(value);
        }
        const { data, message, success } = response;
        if (success) {
            if (isUpdate) {
                updateTicket(data.id, data);
                updateShowTicketInfo(data);
            } else {
                addTicket(data);
            }
            hideTicketForm();
        } else {
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const priceSelectorRow = (
        setFieldValue: (label: string, value: string) => void
    ) => (
        <>
            <Grid item xs={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={clsx(
                        classes.button,
                        priceType === PriceTypes.Free ? 'not-selected' : ''
                    )}
                    onClick={() => setPriceType(PriceTypes.Paid)}
                >
                    Paid
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    className={clsx(
                        classes.button,
                        priceType === PriceTypes.Paid ? 'not-selected' : ''
                    )}
                    onClick={() => {
                        setPriceType(PriceTypes.Free);
                        setFieldValue('price', '0');
                        setPrice(0);
                    }}
                >
                    Free
                </Button>
            </Grid>
        </>
    );

    const formLabel = id ? 'Edit' : 'Add';

    return (
        <>
            <Grid item xs={12} sx={{ pb: 1 }}>
                <Typography variant="h2">{`${formLabel} Ticket`}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <BaseForm<TicketInfo>
                    submitFunc={saveTicket}
                    initialValue={initialValue}
                    validationSchema={validationSchema}
                >
                    {(validationProps: FormFieldValidationProps) => {
                        const { isSubmitting } = validationProps;
                        return (
                            <Grid
                                sx={{ pb: 2 }}
                                container
                                spacing={2}
                                direction="row"
                                alignItems="stretch"
                            >
                                <Grid item xs={12}>
                                    <CustomLabel bold={false} title="Price" />
                                </Grid>
                                {priceSelectorRow(
                                    validationProps.setFieldValue
                                )}
                                <Grid item xs={12}>
                                    <CustomLabel bold={false} title="Name" />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomHookFormTextField
                                        {...validationProps}
                                        name="name"
                                        updateValue={setName}
                                        value={name}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomLabel bold={false} title="Price" />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomLabel
                                        bold={false}
                                        title="Quantity"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomHookFormTextField
                                        {...validationProps}
                                        name="price"
                                        updateValue={setPrice}
                                        value={price}
                                        extraProps={{
                                            type: 'number',
                                            disabled:
                                                priceType === PriceTypes.Free,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomHookFormTextField
                                        {...validationProps}
                                        name="maximumCapacity"
                                        updateValue={setMaximumCapacity}
                                        extraProps={{ type: 'number' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomLabel
                                        bold={false}
                                        title="Sales Start"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomLabel
                                        bold={false}
                                        title="Sales End"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DateTimePicker
                                        value={validationProps.values.startDate}
                                        minDate={new Date()}
                                        onChange={(newValue) => {
                                            validationProps.setFieldValue(
                                                'startDate',
                                                newValue
                                            );
                                            setStartDate(newValue);
                                        }}
                                        InputProps={{ name: 'startDate' }}
                                        InputAdornmentProps={{
                                            position: 'start',
                                        }}
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                helperText={null}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DateTimePicker
                                        value={validationProps.values.endDate}
                                        minDate={
                                            validationProps.values.startDate
                                        }
                                        maxDateTime={endDate < showEndTime ? showEndTime : endDate}
                                        onChange={(newValue) => {
                                            validationProps.setFieldValue(
                                                'endDate',
                                                newValue
                                            );
                                            setEndDate(newValue);
                                        }}
                                        InputProps={{ name: 'endDate' }}
                                        InputAdornmentProps={{
                                            position: 'start',
                                        }}
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                helperText={null}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomLabel
                                        bold={false}
                                        title="Maximum Tickets Per Order"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomHookFormTextField
                                        {...validationProps}
                                        name="maximumPerUser"
                                        updateValue={setMaximumPerUser}
                                        extraProps={{
                                            type: 'number',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomLabel bold={false} title="Note" />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomHookFormTextField
                                        {...validationProps}
                                        name="note"
                                        updateValue={setNote}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        disabled={isSubmitting}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={classes.button}
                                        sx={{ mt: 2 }}
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        );
                    }}
                </BaseForm>
            </Grid>
        </>
    );
};

export default TicketForm;
