import { MenuItem, User } from 'src/types';
import { Icons, UiRoutes } from 'src/constants';
import APP_PERMISSIONS from 'src/constants/permissions';

const {
    MyBandProfileIcon,
    MyBandShowsIcon,
    SettingsIcon,
    LogoutIcon,
    DiscoverBandsIcon,
    LikedBandsIcon,
    FanPlansIcon,
    FanProfileIcon,
    BandsIcon,
    VenuesIcon,
    PromotersIcon
} = Icons;

const allMenuItems = (user: User): MenuItem[] => [
    {
        icon: DiscoverBandsIcon,
        path: UiRoutes.Fans.Discover as string,
        title: 'Discover',
        display: true,
        permissions: [APP_PERMISSIONS.Discover.View]
    },
    {
        icon: FanPlansIcon,
        path: UiRoutes.Fans.MyPlans,
        title: 'My Plans',
        display: true,
        permissions: [APP_PERMISSIONS.MyPlans.View],
    },
    {
        icon: LikedBandsIcon,
        path: UiRoutes.Fans.LikedBands,
        title: 'Liked Bands',
        display: true,
        permissions: [APP_PERMISSIONS.LikedBands.View],
    },
    {
        icon: BandsIcon,
        path: UiRoutes.Bands.List as string,
        title: 'Bands',
        display: true,
        permissions: [APP_PERMISSIONS.Bands.List],
        children: [
            {
                icon: MyBandShowsIcon,
                path: UiRoutes.MyBand.Shows.List(user.bandId),
                title: 'Band Shows',
                display: !(!user.bandId),
                permissions: [APP_PERMISSIONS.Bands.Shows.View],
            },
            {
                icon: MyBandProfileIcon,
                path: UiRoutes.MyBand.Profile(user.bandId),
                title: 'Band Profile',
                display: !(!user.bandId),
                permissions: [APP_PERMISSIONS.Bands.Profile.View],
            },
            {
                icon: SettingsIcon,
                path: UiRoutes.MyBand.Settings(user.bandId),
                title: 'Settings',
                display: !(!user.bandId),
                permissions: [APP_PERMISSIONS.Bands.Settings.View],
            },
        ],
    },
    {
        icon: MyBandShowsIcon,
        path: user.isBandMember && !user.isAdmin ? UiRoutes.MyBand.Shows.List(user.bandId) : UiRoutes.Shows.List,
        title: 'Shows',
        display: true,
        permissions: [
            APP_PERMISSIONS.Shows.List,
            APP_PERMISSIONS.Bands.Shows.List,
        ],
    },
    {
        icon: user.isBandMember ? MyBandProfileIcon : FanProfileIcon,
        path: user.isBandMember ? UiRoutes.MyBand.Profile(user.bandId) : UiRoutes.Fans.Profile(user.fanId),
        title: 'Profile',
        display: true,
        permissions: [APP_PERMISSIONS.Users.Profile.View],
    },
    {
        icon: SettingsIcon,
        path: UiRoutes.MyBand.Settings(user.bandId),
        title: 'Settings',
        display: user.isBandMember,
        permissions: [APP_PERMISSIONS.Bands.Settings.View],
    },

    // {
    //     icon: VenuesIcon,
    //     path: UiRoutes.Venues.List,
    //     title: 'Venues',
    //     permissions: 'Permissions.Venues.List',
    // },
    // {
    //     icon: PromotersIcon,
    //     path: UiRoutes.Promoters.List,
    //     title: 'Promoters',
    //     permissions: 'Permissions.Promoters.List',
    // },
];

const userMenu = (user: User): MenuItem[] => {
    const unLoggedMenu: MenuItem[] = [
        {
            title: 'Login',
            icon: '',
            path: UiRoutes.Auth.Login,
            display: !user,
        },
    ];

    if (!user) return unLoggedMenu;

    const logout: MenuItem = {
        title: 'Log Out',
        icon: LogoutIcon,
        path: UiRoutes.Auth.Logout,
        display: true,
    };

    const menuItems = allMenuItems(user).concat([logout]);

    return menuItems;
};

export default userMenu;
