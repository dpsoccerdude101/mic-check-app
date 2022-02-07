import { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { debounce } from 'lodash';
import { useSearch } from 'src/hooks';
import { CustomLoader } from 'src/components';
import { makeStyles, Container, List, Grow, Typography } from '@material-ui/core';
import PagedAndSortedRequest from 'src/types/pagedAndSortedRequest';
import { ApiRoutes } from 'src/constants';
import { BaseResponse, Band, ListResponse } from 'src/types';
import { Api } from 'src/utils';
import { useSnackbar } from 'notistack';
import BandSearchItem from './bandSearchItem';

const useStyles = makeStyles({
  listWrapper: {

  },
  title: {
    fontWeight: 700,
    fontSize: '1.4rem',
    paddingTop: '15vh',
    textAlign: 'center'
  }
});

const BandsSearch = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [listItems, setListItems] = useState<Band[]>([]);
  const { isSearchOpen, searchText } = useSearch();
  const showList: boolean = isSearchOpen && searchText && searchText.length > 0;
  const showPlaceholder: boolean = isSearchOpen && (!searchText || searchText === '');

  const getBandList = useCallback(
    debounce(async (text, callback) => {
      if (text && text.length > 0) {
        const requestObj: PagedAndSortedRequest = {
          keyword: text,
          maxResultCount: 10,
          skipCount: 0,
          sorting: 'name'
        };
        const url = `${ApiRoutes.Bands.GetAll}?${queryString.stringify(requestObj)}`;
        const response: BaseResponse<ListResponse<Band>> = await Api.get(url);
        const { data, message, success } = response;
        if (success) {
          callback(data);
        } else {
          enqueueSnackbar(message, { variant: 'error' });
          callback([]);
        }
      }
      setLoading(false);
    }, 500), []
  );

  useEffect(() => {
    setLoading(true);
    getBandList(searchText.trim(), (bandResponse: ListResponse<Band>) => {
      const { items } = bandResponse;
      setListItems(items);
    });
  }, [searchText]);

  const renderTextIfNeeded = () => {
    if (showPlaceholder) {
      const children = <Typography className={classes.title} variant='h2'>Search for bands</Typography>;
      return <Grow in={showPlaceholder}>{children}</Grow>;
    }
    return null;
  };

  const renderItem = (band: Band, index: number) => {
    const { id, name, profilePictureId } = band;
    const imgSrc = ApiRoutes.Files.GetFile(profilePictureId);
    return <BandSearchItem key={band.id} index={index} id={id} name={name} imgSrc={imgSrc} />;
  };

  const renderList = () => {
    if (!showList) return null;
    if (isLoading) return <CustomLoader />;
    if (!listItems || listItems.length === 0) { return <Typography variant='body2'>No bands were found!</Typography>; }

    const children = (
      <List className={classes.listWrapper}>
        {listItems.map((el, i) => renderItem(el, i))}
      </List>
    );
    return children;
  };

  return (
    <Container maxWidth={false}>
      {renderTextIfNeeded()}
      {renderList()}
    </Container>
  );
};

export default BandsSearch;
