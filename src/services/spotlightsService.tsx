import { ApiRoutes, TrackActions } from 'src/constants';
import { BaseResponse, LoggedUser, ListResponse, FanSpotlightDto, LikeSpotlightRequest } from 'src/types';
import ip from 'public-ip';
import { Api } from 'src/utils';
import { deviceDetect } from 'react-device-detect';
import FanSpotlightCommentDto from 'src/types/fans/spotlights/fanSpotlightCommentDto';
import { NextPageContext } from 'next';
import TrackService from './trackService';

type FanSpotlightViewRequest = {
  id: string;
  device: string;
  ip: string;
  url: string;
};
interface SpotlightsService {
  addComment: (spotlightId: string, userId: string, text: string) => Promise<BaseResponse<FanSpotlightCommentDto>>;
  checkIfUserLiked: (id: string) => Promise<boolean>;
  computeView: (user: LoggedUser, spotlight: FanSpotlightDto) => Promise<void>;
  getComments: (id: string) => Promise<ListResponse<FanSpotlightCommentDto>>;
  getSpotlight: (id: string, context?: NextPageContext) => Promise<FanSpotlightDto>;
  reactToSpotlight: (spotlight: FanSpotlightDto, liked: boolean, user: LoggedUser) => Promise<BaseResponse>;
}

const spotlightsService: SpotlightsService = {
  addComment: async (spotlightId: string, userId: string, text: string) => {
    const request = {
      text,
      userId
    };
    const response: BaseResponse<FanSpotlightCommentDto> = await Api.post(ApiRoutes.FansSpotlights.AddComment(spotlightId), request);
    return response;
  },
  checkIfUserLiked: async (id: string) => {
    const response: BaseResponse<boolean> = await Api.get(ApiRoutes.FansSpotlights.UserLiked(id));
    const { data, message, success } = response;
    if (!success) {
      console.log('Error: ', message);
      return false;
    }
    return data;
  },
  computeView: async (user: LoggedUser, spotlight: FanSpotlightDto) => {
    const { id } = spotlight;
    const deviceObj = deviceDetect();
    const device = `${deviceObj.osName} ${deviceObj.osVersion} ${deviceObj.userAgent}`;
    const ipAddr = await ip.v4();
    const request: FanSpotlightViewRequest = {
      id,
      device,
      ip: ipAddr,
      url: window.location.href
    };

    const response: BaseResponse = await Api.post(ApiRoutes.FansSpotlights.ComputeView, request);
    const { message, success } = response;
    if (success) {
      const spotlightTrackObj = TrackService.getSpotlightTrackObj(spotlight);
      TrackService.trackAction(TrackActions.USER_WATCHED_SPOTLIGHT, spotlightTrackObj, user);
    } else {
      console.log('Error: ', message);
    }
  },
  getComments: async (id: string) => {
    const response: BaseResponse<ListResponse<FanSpotlightCommentDto>> = await Api.get(ApiRoutes.FansSpotlights.GetComments(id));
    const { data, message, success } = response;
    if (success) {
      return data;
    }
    console.log('Error: ', message);
    return { totalCount: 0, items: null };
  },
  getSpotlight: async (id: string, context?: NextPageContext) => {
    const response: BaseResponse<FanSpotlightDto> = await Api.get(ApiRoutes.FansSpotlights.Get(id), context);
    const { data, message, success } = response;
    if (success) { return data; }
    console.log('Error: ', message);
    return null;
  },
  reactToSpotlight: async (spotlight: FanSpotlightDto, liked: boolean, user: LoggedUser) => {
    const { id } = spotlight;
    const request: LikeSpotlightRequest = {
      id,
      liked
    };

    const response: BaseResponse = await Api.post(ApiRoutes.FansSpotlights.React, request);
    const { message, success } = response;
    if (success) {
      const action = liked ? TrackActions.USER_LIKED_SPOTLIGHT : TrackActions.USER_DISLIKED_SPOTLIGHT;
      const spotlightTrackObj = TrackService.getSpotlightTrackObj(spotlight);
      TrackService.trackAction(action, spotlightTrackObj, user);
      return { success: true, message };
    }
    return { success: false, message };
  }
};

export default spotlightsService;
