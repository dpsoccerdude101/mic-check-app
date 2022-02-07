import { Show, TicketOrderItem, TicketInfo, ContactInfoRegisterModel } from 'src/types';
import PaymentDetails from 'src/types/order/cart/paymentDetails';
import create from 'zustand';
import persist from './persist';

interface TicketInstanceState {
    clearOrder: () => void;

    orderItems: TicketOrderItem[];
    updateOrderItem: (id: string, item: TicketOrderItem) => void;

    show: Show;
    setShow: (value: Show) => void;
    updateShowTicketInfo: (ticketInfo: TicketInfo) => void;

    returnRoute: string;
    setReturnRoute: (value: string) => void;

    sourceBandId: string;
    setSourceBandId: (value: string) => void;

    supportedShowBandIds: number[];
    setSupportedShowBandIds: (value: number[]) => void;

    paymentDetails: PaymentDetails;
    setPaymentDetails: (value: PaymentDetails) => void;

    squarePayment: boolean;
    setSquarePayment: (value: boolean) => void;

    checkOutOpen: boolean;
    setCheckOutOpen: (value: boolean) => void;

    checkOutSuccess: boolean;
    setCheckOutSuccess: (value: boolean) => void;

    contactInfo: ContactInfoRegisterModel;
    setContactInfo: (value: ContactInfoRegisterModel) => void;

}

const emptyState: any = {
    orderItems: [],
    show: null,
    returnRoute: null,
    sourceBandId: null,
    paymentDetails: null,
    squarePayment: false,
    checkOutOpen: false,
    checkOutSuccess: null,
    contactInfo: {email:'', phoneNumber:'', acceptTerms:false},
};

const initialState: TicketInstanceState = {
    ...emptyState,
    clearOrder: () => {},
    updateOrderItem: () => {},
    setShow: () => {},
    updateShowTicketInfo: () => {},
    setSourceBandId: () => {},
    setPaymentDetails: () => {},
    setSquarePayment: () => {},
    setCheckOutOpen: () => {},
    setCheckOutSuccess: () => {},
    setContactInfo: () => {},
};

const useTicketInstanceStore = create<TicketInstanceState>(
    persist(
        (set) => ({
            ...initialState,

            clearOrder: () =>
                set((state: TicketInstanceState) => {
                    console.log('CLEARING ORDER');
                    return {
                        ...state,
                        orderItems: [],
                    };
                }),

            updateOrderItem: (id: string, item: TicketOrderItem) => {
                set((state: TicketInstanceState) => {
                    const { orderItems } = state;
                    const { quantity } = item;
                    const currentItem =
                        orderItems.find((el) => el.id === id);
                    let newItems = [];
                    let changed = true;
                    if (quantity > 0) {
                        if (currentItem) {
                            // update
                            currentItem.quantity = quantity;
                            
                            newItems = orderItems.filter(e => e.id !== id);
                            newItems.push(currentItem);
                        } else {
                            // add
                            newItems = [...orderItems, item];
                        }
                    } else if (currentItem) {
                        // remove
                        newItems = orderItems.filter((el) => el.id !== id);
                    } else {
                        changed = false;
                    }
                    return {
                        ...state,
                        orderItems: changed ? newItems : orderItems,
                    };

                });
            },

            setShow: (value: Show) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    show: value,
                })),

            updateShowTicketInfo: (ticketInfo: TicketInfo) => {
                set((state: TicketInstanceState) => {
                    const { show } = state;
                    const { id: ticketInfoId } = ticketInfo;
                    const currentTicketInfo = show.ticketInfos.find(e => e.id === ticketInfoId);
                    
                    if (currentTicketInfo) {
                        const position = show.ticketInfos.findIndex(e => e.id === ticketInfoId);
                        show.ticketInfos[position] = ticketInfo;
                    }

                    return {
                        ...state,
                        show,
                    };
                });
            },

            setReturnRoute: (value: string) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    returnRoute: value,
                })),

            setSourceBandId: (value: string) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    sourceBandId: value,
                })),

            setSupportedShowBandIds: (value: number[]) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    supportedShowBandIds: value,
                })),

            setPaymentDetails: (value: PaymentDetails) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    paymentDetails: value,
                })),

            setSquarePayment: (value: boolean) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    squarePayment: value,
                })),

            setCheckOutOpen: (value: boolean) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    checkOutOpen: value,
                })),

            setCheckOutSuccess: (value: boolean) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    checkOutSuccess: value,
                })),

            setContactInfo: (value: ContactInfoRegisterModel) =>
                set((state: TicketInstanceState) => ({
                    ...state,
                    contactInfo: value,
                })),

        }),
        'ticket-instance-store'
    )
);

export default useTicketInstanceStore;
