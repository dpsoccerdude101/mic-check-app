const PREFIX = 'Permissions.';

const Roles: any = {
    List: `${PREFIX}Roles.List`,
    View: `${PREFIX}Roles.View`,
    Add: `${PREFIX}Roles.Add`,
    Update: `${PREFIX}Roles.Update`,
    Delete: `${PREFIX}Roles.Delete`,
};

const Users: any = {
    List: `${PREFIX}User.List`,
    View: `${PREFIX}User.View`,
    Add: `${PREFIX}User.Add`,
    Update: `${PREFIX}User.Update`,
    Delete: `${PREFIX}User.Delete`,
    Profile: {
        View: `${PREFIX}User.Profile.View`
    }
};

const Bands: any = {
    List: `${PREFIX}Bands.List`,
    View: `${PREFIX}Bands.View`,
    Add: `${PREFIX}Bands.Add`,
    Edit: `${PREFIX}Bands.Edit`,
    Delete: `${PREFIX}Bands.Delete`,
    Shows: {
        View: `${PREFIX}Bands.Shows.View`,
        Add: `${PREFIX}Bands.Shows.Add`
    },
    Settings: {
        View: `${PREFIX}Bands.Settings.View`
    },
    Profile: {
        View: `${PREFIX}Bands.Profile.View`
    }
};

const Spotlight: any = {
    Add: `${PREFIX}Spotlight.Add`,
    Delete: `${PREFIX}Spotlight.Delete`
};

const TicketInfo: any = {
    List: `${PREFIX}TicketInfo.List`,
    View: `${PREFIX}TicketInfo.View`,
    Edit: `${PREFIX}TicketInfo.Edit`,
    Add: `${PREFIX}TicketInfo.Add`,
    Delete: `${PREFIX}TicketInfo.Delete`,
    Scan: `${PREFIX}TicketInfo.Scan`
};

const Shows: any = {
    List: `${PREFIX}Shows.List`,
    View: `${PREFIX}Shows.View`,
    Edit: `${PREFIX}Shows.Edit`,
    Add: `${PREFIX}Shows.Add`,
    Delete: `${PREFIX}Shows.Delete`
};

const Discover: any = {
    View: `${PREFIX}Discover.View`
};

const LikedBands: any = {
    View: `${PREFIX}LikedBands.View`
};

const MyPlans: any = {
    View: `${PREFIX}MyPlans.View`
};

const APP_PERMISSIONS = {
  Shows,
  Discover,
  LikedBands,
  MyPlans,
  Bands,
  Users,
  Roles,
  TicketInfo,
  Spotlight,
};
export default APP_PERMISSIONS;
