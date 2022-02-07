import Dialog from 'src/components/ticket/order/dialog';
import {
    TicketOrderHeader as Header,
    TicketOrderBillingInfo as Body,
} from 'src/components';
import { useEffect } from 'react';
import { useNavigationStore } from 'src/stores';

const Order = () => {
    const { hideNavBar } = useNavigationStore((state) => ({
        hideNavBar: state.hideNavBar,
    }));

    useEffect(() => {
        hideNavBar();
    }, []);

    return <Dialog header={<Header />} body={<Body />} />;
};

export default Order;
