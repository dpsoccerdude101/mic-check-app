import { Fragment, useEffect, useState } from 'react';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { CustomBox, CustomLabel } from 'src/components';
import { useBandLinks } from 'src/hooks/useBand';
import { useBand } from 'src/hooks';
import { Grid, TextField } from '@material-ui/core';
import { BaseResponse, SocialMedia } from 'src/types';
import BandSocialMedia from 'src/types/band/bandSocialMedia';

const LinksTab = () => {
  const { links, setLinks } = useBandLinks();
  const { band } = useBand();
  const { socialMedias } = band;
  const [localLinks, setLocalLinks] = useState<BandSocialMedia[]>([]);

  useEffect(() => {
    const loadLinks = async (): Promise<BandSocialMedia[]> => {
      let loadedLinks: BandSocialMedia[] = [];
      const hasLinksOnState = links.length > 0;
      const hasLinksOnBand = socialMedias && socialMedias.length > 0;
      if (hasLinksOnState) {
        loadedLinks = links;
      } else if (hasLinksOnBand) {
        loadedLinks = socialMedias;
      }
      return loadedLinks;
    };

    const loadExistentMedias = async (): Promise<SocialMedia[]> => {
      const response: BaseResponse<any> = await Api.get(ApiRoutes.SocialMedias.GetAll);
      const { data, success } = response;
      let medias: SocialMedia[] = [];

      if (success) { medias = data.items as SocialMedia[]; }
      return medias;
    };

    const fillUnexistentLinks = async (loadedLinks: BandSocialMedia[], allMedias: SocialMedia[]): Promise<BandSocialMedia[]> => {
      const tempLinks = loadedLinks;
      for (let i = 0; i < allMedias.length; i++) {
        const currentMedia = allMedias[i];
        const filledLink = tempLinks.find((el) => el.socialMediaId === currentMedia.id);
        if (!filledLink) {
          const emptyLink: BandSocialMedia = { bandId: band.id, socialMediaId: currentMedia.id, socialMedia: currentMedia };
          tempLinks.push(emptyLink);
        }
      }
      return tempLinks;
    };

    const main = async () => {
      const allMedias: SocialMedia[] = await loadExistentMedias();
      let tempLinks = await loadLinks();
      tempLinks = await fillUnexistentLinks(tempLinks, allMedias);
      setLocalLinks(tempLinks);
    };
    main();
  }, []);

  const renderLink = (obj: BandSocialMedia) => (
    <Fragment key={obj.socialMediaId}>
      <Grid item xs={12}><CustomLabel title={obj.socialMedia.name} /></Grid>
      <Grid item xs={12}>
        <TextField
          type='text'
          value={obj.url}
          onChange={(e) => {
            const tempLinks = localLinks;
            const localLink = tempLinks.find((el) => el.socialMediaId === obj.socialMediaId);
            localLink.url = e.target.value;
            setLocalLinks(tempLinks);
            setLinks(tempLinks);
          }}
        />

      </Grid>
    </Fragment>
  );

  const renderLinks = () => {
    const objsToReturn: JSX.Element[] = [];
    for (let i = 0; i < localLinks.length; i++) {
      const obj = renderLink(localLinks[i]);
      objsToReturn.push(obj);
    }
    return objsToReturn;
  };

  return (
    <CustomBox>
      <Grid container spacing={2}>
        {renderLinks()}
      </Grid>
    </CustomBox>
  );
};

export default LinksTab;
