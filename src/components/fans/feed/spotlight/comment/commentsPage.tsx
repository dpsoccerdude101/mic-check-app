import { useEffect, useState, useRef } from 'react';
import { useNavigationStore, useSpotlightStore } from 'src/stores';
import { navbarHeight } from 'src/constants/appConstants';
import { Box, Button, TextField } from '@material-ui/core';
import { CustomLoader } from 'src/components';
import { TrackService, SpotlightsService } from 'src/services';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { ListResponse, FanSpotlightCommentDto, BaseResponse } from 'src/types';
import { TrackActions } from 'src/constants';
import { useAuth } from 'src/hooks';
import CommentItem from './commentItem';

const CommentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const newCommentRowEl = useRef<HTMLDivElement>();
  const newCommentRowHeight = newCommentRowEl && newCommentRowEl.current ? newCommentRowEl.current.clientHeight : 0;

  const { showBackArrow, showNavBar, hideSearchBar, setTitle } = useNavigationStore((state) => ({
    hideSearchBar: state.hideSearchBar,
    setTitle: state.setTitle,
    showBackArrow: state.showBackArrow,
    showNavBar: state.showNavBar,
  }));

  const { id, comments, addComment, setComments } = useSpotlightStore((state) => ({
    id: state.id,
    addComment: state.addComment,
    comments: state.comments,
    setComments: state.setComments
  }));

  useEffect(() => {
    const loadComments = async () => {
      const updatedComments: ListResponse<FanSpotlightCommentDto> = await SpotlightsService.getComments(id);
      if (updatedComments && updatedComments.totalCount > 0) {
        setComments(updatedComments.items);
      } else { setComments([]); }
      setLoading(false);
    };

    hideSearchBar();
    showNavBar();
    showBackArrow();
    setTitle('Comments');
    loadComments();
  }, []);

  const commentList = () => {
    if (loading) return <CustomLoader />;
    if (comments.length > 0) {
      return comments.map((el) => <CommentItem comment={el} key={uuidv4()} />);
    }
    return null;
  };

  const handleClick = async () => {
    setLoading(true);
    const response: BaseResponse<FanSpotlightCommentDto> = await SpotlightsService.addComment(id, user.id, text);
    const { data, message, success } = response;
    if (success) {
      addComment(data);
      setText('');
      TrackService.trackAction(TrackActions.USER_COMMENTED_ON_SPOTLIGHT, { text: data.text }, user);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
    }
    setLoading(false);
  };

  const newCommentRow = () => (
    <Box
      position='absolute'
      width='100%'
      bottom='0'
      display='flex'
      justifyContent='space-around'
      alignItems='center'
      ref={newCommentRowEl}
      sx={{ px: 1 }}
    >
      <TextField
        style={{ width: '80%', backgroundColor: 'white', color: 'black' }}
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        maxRows={4}
        disabled={loading}
        placeholder='Insert comment...'
        variant='standard'
      />
      <Button disabled={loading} onClick={handleClick} variant='contained'>Send</Button>
    </Box>
  );

  const commentsBox = () => (
    <Box
      justifyContent='center'
      width='100%'
      height={`calc(100vh - ${navbarHeight}px - ${newCommentRowHeight}px)`}
      marginTop={`-${(navbarHeight)}px`}
      sx={{ px: 1 }}
    >
      {commentList()}
    </Box>
  );

  return (
    <>
      {commentsBox()}
      {newCommentRow()}
    </>
  );
};

export default CommentsPage;
