import { useNavigationStore, useTicketInstanceStore } from 'src/stores';
import {
    TicketOrderDetails as Details,
    TicketOrderFooter as Footer,
    TicketOrderInfoList as InfoList,
    TicketOrderBillingInfo as BillingInfo,
} from 'src/components';
import { useEffect } from 'react';
import GrayDivider from './grayDivider';
import SupportedBands from './bandImages/supportedBands';
import ContactInfo from './contactInfo';

const TicketOrderBody = () => {
    const { clear, itemsCount, show, paymentDetails } = useTicketInstanceStore(
        (state) => ({
            clear: state.clearOrder,
            itemsCount: state.orderItems.length,
            show: state.show,
            paymentDetails: state.paymentDetails,
        })
    );

    const { hideNavBar, hideSearchBar } = useNavigationStore((state) => ({
        hideNavBar: state.hideNavBar,
        hideSearchBar: state.hideSearchBar,
    }));

    useEffect(() => {
        clear();
        hideNavBar();
        hideSearchBar();
    }, []);

    const detailsIfNeeded = () => {
        if (itemsCount === 0) return null;

        return (
            <>
                <GrayDivider />
                <Details />
            </>
        );
    };

    // const billingInfoIfNeeded = () => {
    //     return paymentDetails?.total > 0 ? (
    //         <>
    //             <GrayDivider />
    //             <BillingInfo />
    //         </>
    //     ) : null;
    // };

    return (
        <>
            <InfoList infos={show.ticketInfos} />
            <GrayDivider />
            <SupportedBands />
            {detailsIfNeeded()}
            <GrayDivider />
            <ContactInfo />
            {/* {billingInfoIfNeeded()} */}
            <Footer show={show} />
        </>
    );
};

export default TicketOrderBody;
