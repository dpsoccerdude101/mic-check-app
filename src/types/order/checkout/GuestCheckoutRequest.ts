import { CheckoutRequest, ContactInfoRegisterModel } from 'src/types';

type GuestCheckoutRequest = CheckoutRequest & {
    contactInfo: ContactInfoRegisterModel;
};

export default GuestCheckoutRequest;
