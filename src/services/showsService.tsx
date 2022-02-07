import { NextPageContext } from 'next';
import queryString from 'query-string';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import { BaseResponse, Show, ListResponse, ShowsQueryRequest } from 'src/types';

interface ShowsService {
    getFromBand: (
        request: ShowsQueryRequest,
        context?: NextPageContext
    ) => Promise<BaseResponse<ListResponse<Show>>>;
    getById: (id: string) => Promise<BaseResponse<Show>>;
    getFeaturedShow: () => Promise<BaseResponse<Show | null>>;
}

const showsService: ShowsService = {
    getFromBand: async (
        request: ShowsQueryRequest,
        context?: NextPageContext
    ) => {
        const url = `${
            ApiRoutes.Shows.FromBandWithQuery
        }?${queryString.stringify(request)}`;
        const response: BaseResponse<ListResponse<Show>> = await Api.get(
            url,
            context
        );
        return response;
    },
    getById: async (id: string) => {
        const url = `${ApiRoutes.Shows.Get(id)}`;
        const response: BaseResponse<Show> = await Api.get(url);
        return response;
    },
    getFeaturedShow: async () => {
        const url = `${ApiRoutes.Shows.GetFeaturedShow()}`;
        const response: BaseResponse<Show | null> = await Api.get(url);
        return response;
    },
};

export default showsService;
