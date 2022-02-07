const Auth: any = {
    External: {
        FinalStep: '/auth/external/final-step',
    },
    ForgotPassword: '/auth/forgot-password',
    Login: '/auth/login',
    Logout: '/auth/logout',
    Register: '/auth/register',
    ValidateFanCode: (id: string) => `/auth/validate-fan-code/${id}`,
    ValidateBandMemberCode: (id: string) =>
        `/auth/validate-band-member-code/${id}`,
    VerifyFanEmail: (id: string) => `/auth/verify-email/${id}?type=fan`,
    VerifyFanEmailWithReturnUrl: (id: string, returnUrl: string) =>
        `/auth/verify-email/${id}?type=fan&returnUrl=${returnUrl}`,
    VerifyBandEmail: (id: string) => `/auth/verify-email/${id}?t=band`,
};

const Bands: any = {
    FanSpotlights: '/bands/fan-spotlights',
    List: '/bands/list',
    Profile: (id: string): string => `/bands/profile/${id}`,
    ValidateMember: (id: string) => `/bands/validate-member/${id}`,
};

const Fans: any = {
    GetPending: (id: string) => `fans/get-pending/${id}`,
    Discover: '/fans/discover',
    Feed: {
        toString: () => '/fans/feed',
        Spotlight: '/fans/feed/spotlight',
    },
    MyPlans: '/fans/my-plans',
    LikedBands: '/fans/liked-bands',
    Profile: (id: string) => `/fans/profile/${id}`,
    Settings: '/fans/settings',
    Validate: (id: string) => `/fans/validate/${id}`,
};

const MyBand: any = {
    Home: '/my-band/home',
    Profile: (id: string) => `/my-band/profile/${id}`,
    Settings: (id: string): string => `/my-band/settings/${id}`,
    Shows: {
        New: '/my-band/shows/new',
        List: (id: string) => `/my-band/shows/${id}`,
    },
};

const Tickets: any = {
    Order: '/tickets/order',
    TicketOrderConfirmation: (id: string) => `/tickets/confirmation/${id}`,
    TicketInstanceQR: (id: string) => `/tickets/instance/${id}/qr`,
    BillingInfo: '/tickets/order/billing',
    Checkout: '/tickets/checkout',
    GuestCheckout: '/tickets/checkout/guest',
};

const Shows: any = {
    Edit: (id: string) => `/shows/edit/${id}`,
    Management: '/shows/management',
    List: '/shows/list'
};

const Venues: any = {
    List: '/venues/list'
};

const Promoters: any = {
    List: '/promoters/list'
};

const Root = '/';

export default { Auth, Bands, Fans, MyBand, Shows, Tickets, Venues, Promoters, Root };
