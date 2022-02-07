import {
    FanSpotlightBandQueryRequest,
    PatronListRequest,
    ShowsQueryRequest,
    TicketOrderItem,
} from 'src/types';
import queryString from 'query-string';
import PagedAndSortedRequest from 'src/types/pagedAndSortedRequest';

const baseApiRoute = process.env.NEXT_PUBLIC_BASE_API_ROUTE;

const Account: any = {
    GetPendingResetPassword: (id: string) => `account/reset-password/${id}`,
    ForgotPassword: 'account/forgot-password',
    Login: 'account/login',
    ResetPassword: 'account/reset-password',
    SocialLogin: 'account/social-login',
    LoggedUser: 'account/logged-user',
};

const Address: any = {
    GetCity: (text: string) => `address/city/${text}`,
    GetLocation: (text: string) => `address/locations/${text}`,
};

const Bands: any = {
    Add: 'bands',
    CreateAsAdmin: 'bands/as-admin',
    Delete: (id: string) => `bands/${id}`,
    DeleteMedia: (id: string) => `bands/media/${id}`,
    Get: (id: string): string => `band/${id}`,
    GetAll: 'bands',
    GetBandIdFromMember: (id: string): string => `bands/from-member/${id}`,
    GetFansCount: (id: string) => `bands/${id}/fans-count`,
    GenerateQRCode: 'bands/generate-qrcode',
    GetName: (id: string) => `bands/name/${id}`,
    GetPendingMember: (id: string): string => `bands/pending-member/${id}`,
    GetPrincipalMedias: (id: string): string => `bands/${id}/principal-medias`,
    List: 'bands/list',
    ListCombo: (text: string) => `bands/combo/${text}`,
    Profile: 'bands/profile',
    ValidateCode: 'bands/validate-code',
    ValidateMember: 'bands/validate-member',
    RegisterSocial: 'bands/register-social',
    SaveGeneral: 'bands/profile/general',
    SaveMedia: 'bands/profile/medias',
    SaveSocialMedias: 'bands/profile/social-medias',
    Shows: 'bands/shows',
};

const BandMembers: any = {
    AddUser: 'band-members',
    Delete: (id: string) => `band-members/${id}`,
    List: (bandId: string) => `band-members/${bandId}`,
    ResendVerificationEmail: (id: string) =>
        `band-members/resend-verification-email/${id}`,
};

const filesController = `${baseApiRoute}files`;
const Files: any = {
    GetBandPicture: (id: string) => `${filesController}/band-picture/${id}`,

    GetFanPicture: (id: string) => `${filesController}/fan-picture/${id}`,

    GetFile: (id: string) => `${filesController}/file/${id}`,
    GetFilePath: (id: string) => `${filesController}/file/${id}/path`,
};

const Fans: any = {
    Add: 'fans',
    CheckIfPlanToGoToShow: (showId: string) =>
        `fans/plan-to-go-to-show/${showId}`,
    GetIdFromUserId: (userId: string) => `fans/id-from-user/${userId}`,
    GetMyPlanToGoShows: 'fans/shows',
    GetPending: (id: string) => `fans/pending-validation/${id}`,
    GetProfile: (id: string) => `fans/${id}/profile`,
    ListDiscoverBands: (request: ShowsQueryRequest) =>
        `fans/discover-bands?${queryString.stringify(request)}`,
    ListLikedBands: (request: PagedAndSortedRequest) =>
        `fans/liked-bands?${queryString.stringify(request)}`,
    LikeBand: 'fans/like-band',
    FinishRegistration: 'fans/finish-registration',
    IsFanFromBand: (id: string) => `fans/is-fan-from-band/${id}`,
    PlanToGoToShow: 'fans/plan-to-go-to-show',
    RegisterSocial: 'fans/register-social',
    UpdateProfile: (id: string) => `fans/${id}/profile`,
    ValidateCode: 'fans/validate-code',
    ResendVerificationEmail: (validationId: string) =>
        `fans/resend-verification-email/${validationId}`,
};

const FansSpotlights: any = {
    AddNew: 'spotlights',
    AddComment: (spotlightId: string) => `spotlights/${spotlightId}/comment`,
    ComputeView: 'spotlights/compute-view',
    DeleteSpotlight: (id: string) => `spotlights/${id}`,
    Get: (id: string) => `spotlights/${id}`,
    GetComments: (id: string) => `spotlights/${id}/comment`,
    GetForFeed: (request: PagedAndSortedRequest) =>
        `spotlights?${queryString.stringify(request)}`,
    GetFromBand: (request: FanSpotlightBandQueryRequest) =>
        `spotlights/from-band?${queryString.stringify(request)}`,
    React: 'spotlights/react',
    UserLiked: (spotlightId: string) => `spotlights/user-liked/${spotlightId}`,
};

const MusicalGenre: any = {
    GetAll: 'musical-genre?MaxResultCount=1000&Sorting=name',
};

const QRCode: any = {
    Get: (id: string) => `qrcode/get/${id}`,
    GetUserScanObj: 'qrcode/scan',
};

const Shows: any = {
    GetAll: 'show',
    Add: 'shows',
    Delete: (id: string) => `shows/${id}`,
    Get: (id: string) => `shows/${id}`,
    FromBand: (id: string) => `shows/from-band/${id}`,
    FromBandWithQuery: 'shows/from-band-query',
    Update: 'shows',
    GetFeaturedShow: () => 'shows/featured',
};

const SocialMedias: any = {
    GetAll: 'social-media?Sorting=name',
};

const TicketInfos: any = {
    Create: 'ticket-info',
    Update: (id: string) => `ticket-info/${id}`,
};

const TicketInstances: any = {
    // Order: 'ticket-instances/order',
    GenerateQRCode: 'ticket-instances/generate-qrcode',
    GetUserTickets: (showId: string) => `ticket-instances/${showId}`,
    AdmitTicket: 'ticket-instances/admit',
    ScanTicket: 'ticket-instances/scan',
    GetById: 'ticket-instances',
    GetDetailsForScanById: 'ticket-instances/details/scan',
    GetDetailsForScanByShowId: (request: PatronListRequest) =>
        `ticket-instances/details/scan/by-show?${queryString.stringify(
            request
        )}`,
    GetRemainingTickets: (ticketInfoId: string, maxCapacity: number) =>
        `ticket-instance/remaining-tickets/${ticketInfoId}?maxCapacity=${maxCapacity}`,
};

const Orders: any = {
    Checkout: 'order/checkout',
    GuestCheckout: 'order/checkout/guest',
    Checkout2: 'order/checkout2',
    GuestCheckout2: 'order/checkout2/guest',
    Confirm: 'order/checkout2/confirm',
    Cancel: (paypalOrderId: string) =>
        `order/checkout2/cancel/${paypalOrderId}`,
    Free: 'order/free',
    GuestFree: 'order/guestFree',
};

const Cart: any = {
    CalculatePayment: 'cart/calculate-payment',
    CreateCart: 'cart',
    CreateSquareCart: 'cart/square',
};

const TicketOrderConfirmation: any = {
    // TODO: clean up when we have order numbers
    Get: 'tickets/order/confirmation',
    GetByOrderId: (orderId: string) => `tickets/order/${orderId}/confirmation`,
};

const Payments: any = {
    GetPayPalClientId: 'payments/paypal-client-id',
};

const SquareLog: any = {
    GetAll: (showId: string) => `square/square-log/${showId}`,
};

const DeviceCode: any = {
    Code: (showId: string) => `square/device-code/code/${showId}`,
};

const TerminalCheckout: any = {
    Checkout: 'square/terminal-checkout/checkout',
    Confirm: (orderId: string, isConfirmed: boolean) =>
        `square/terminal-checkout/confirm?orderId=${orderId}&isConfirmed=${isConfirmed}`,
};

const YouTubeVideos: any = {
    SaveYTVideo: 'you-tube-video', //post request
    GetAllBandVideos: (bandId: string | number) =>
        `you-tube-video/by-band/${bandId}`,
    DeleteYTVideo: (id: string) => `you-tube-video/${id}`, //not ytId
};

export default {
    baseApiRoute,
    Account,
    Address,
    Bands,
    BandMembers,
    Fans,
    FansSpotlights,
    Files,
    MusicalGenre,
    QRCode,
    Shows,
    SocialMedias,
    TicketInfos,
    TicketInstances,
    TicketOrderConfirmation,
    Payments,
    Orders,
    Cart,
    SquareLog,
    DeviceCode,
    TerminalCheckout,
    YouTubeVideos,
};
