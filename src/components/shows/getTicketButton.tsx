import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import { UiRoutes } from 'src/constants';
import { useTicketInstanceStore } from 'src/stores';
import { Show } from 'src/types';

type GetTicketButtonProps = {
    show: Show;
    sourceBandId: string;
};

const GetTicketButton = ({ show, sourceBandId }: GetTicketButtonProps) => {
    const router = useRouter();
    const { 
        setShow, 
        setSquarePayment, 
        setReturnRoute, 
        setSourceBandId,
        setContactInfo,
    } = useTicketInstanceStore((state) => ({
            setShow: state.setShow,
            setSquarePayment: state.setSquarePayment,
            setReturnRoute: state.setReturnRoute,
            setSourceBandId: state.setSourceBandId,
            setContactInfo: state.setContactInfo,
        })
    );

    const handleClick = () => {

        setShow(show);
        setSquarePayment(false);
        setSourceBandId(sourceBandId);
        setContactInfo({email:'', phoneNumber:'', acceptTerms:false});
        const currentRoute = router.asPath;
        setReturnRoute(currentRoute);
        router.push(UiRoutes.Tickets.Order);
    };

    return (
        <Button variant="contained" color="primary" onClick={handleClick}>
            Get Ticket
        </Button>
    );
};

export default GetTicketButton;
