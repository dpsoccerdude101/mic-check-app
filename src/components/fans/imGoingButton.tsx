import { useEffect, useState } from 'react';
import {
    Button,
    ButtonProps,
    CircularProgress,
    makeStyles,
} from '@material-ui/core';
import { BaseResponse, FanShowRequest } from 'src/types';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { useSnackbar } from 'notistack';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

const useStyles = makeStyles({
    root: {
        marginTop: 5,
    },
});

type ImGoingButtonProps = {
    bandId: string;
    showId: string;
    buttonProps?: ButtonProps;
};

const ImGoingButton = ({ bandId, showId, buttonProps }: ImGoingButtonProps) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [imGoing, setImGoing] = useState(false);

    useEffect(() => {
        let mounted = true;
        const checkIfUserPlanToGoToShow = async () => {
            const response: BaseResponse<boolean> = await Api.get(
                ApiRoutes.Fans.CheckIfPlanToGoToShow(showId)
            );
            const { data, success } = response;
            if (mounted) {
                if (success) {
                    setImGoing(data);
                }
                setLoading(false);
            }
        };

        checkIfUserPlanToGoToShow();
        return () => {
            mounted = false;
        };
    }, [showId]);

    const handleIsGoingClick = async (isGoing: boolean) => {
        const request: FanShowRequest = {
            showId,
            bandId,
            isGoing,
        };

        const response: BaseResponse = await Api.post(
            ApiRoutes.Fans.PlanToGoToShow,
            request
        );
        const { message, success } = response;
        if (!success) {
            enqueueSnackbar(message, { variant: 'error' });
        }

        setImGoing(isGoing);
    };

    const renderImGoingButton = () => {
        if (loading) return <CircularProgress />;
        const text = imGoing ? 'Planned' : "I'm Going";
        const icon = imGoing ? <CheckOutlinedIcon /> : <></>;
        return (
            <Button
                className={classes.root}
                onClick={(e) => {
                    e.stopPropagation();
                    handleIsGoingClick(!imGoing);
                }}
                variant="outlined"
                startIcon={icon}
                size="medium"
                {...buttonProps}
            >
                {text}
            </Button>
        );
    };

    return renderImGoingButton();
};

export default ImGoingButton;
