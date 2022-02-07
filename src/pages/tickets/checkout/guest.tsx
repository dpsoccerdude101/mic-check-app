import {
    PageWrapper,
    GuestCheckoutBody,
    GuestCheckoutHeader,
} from 'src/components';

const GuestCheckout = () => {
    return (
        <PageWrapper title={'Guest Checkout'}>
            <GuestCheckoutHeader />
            <GuestCheckoutBody />
        </PageWrapper>
    );
};

export default GuestCheckout;
