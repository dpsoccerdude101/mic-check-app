import { BaseUser, FanSpotlightDto } from 'src/types';
import { isAndroid, isIOS, isDesktop, deviceDetect } from 'react-device-detect';

interface TrackService {
  getSpotlightTrackObj: (spotlight: FanSpotlightDto) => any;
  identify: (id: string, user: BaseUser) => void;
  page: (title: string) => void;
  trackAction: (action: string, payload: any, user: BaseUser) => void;
}

const getDevice = () => {
  const deviceObj: any = deviceDetect();
  let device = '';
  if (isAndroid) {
    device = 'Android';
  } else if (isIOS) {
    device = 'IOS';
  } else if (isDesktop) {
    device = 'Desktop';
  }

  let deviceType = '';
  if (device === 'Desktop') {
    deviceType = deviceObj.osName ?? '';
  } else {
    deviceType = deviceObj.model ?? '';
  }

  const trackObj = {
    device,
    deviceType
  };
  return trackObj;
};

const getTrackUser = (user: BaseUser) => {
  let trackUser: any = {
    userId: null,
    email: null,
    userType: 'UNLOGGED_USER'
  };
  if (user) {
    const { email, type } = user;
    trackUser = {
      userId: user.id,
      email,
      userType: type
    };
  }
  const trackWithDevice = { ...trackUser, ...getDevice() };
  return trackWithDevice;
};

const trackService: TrackService = {
  getSpotlightTrackObj: (spotlight: FanSpotlightDto) => {
    const { id, band, show, title } = spotlight;
    const mainObj = {
      spotlightId: id,
      spotlightTitle: title,
      bandId: band.id,
      bandName: band.name
    };

    if (!show) { return mainObj; }

    const showObj = {
      showId: show.id,
      showDate: show.date,
      showName: show.name
    };

    return { ...mainObj, ...showObj };
  },
  identify: (id: string, user: BaseUser) => {
    (window as any).analytics.identify(id, getTrackUser(user));
  },
  page: (title: string) => {
    (window as any).analytics.page(title, getDevice());
  },
  trackAction: (action: string, payload: any, user: BaseUser) => {
    const trackUser = getTrackUser(user);
    const trackObj = { ...trackUser, ...payload };
    (window as any).analytics.track(action, trackObj);
  }
};

export default trackService;
