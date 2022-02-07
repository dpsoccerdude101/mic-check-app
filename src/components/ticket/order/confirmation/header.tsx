import { Box, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/close';
import { useRouter } from 'next/router';
import { Colors } from 'src/constants';
import { useTicketInstanceStore } from 'src/stores';

const Header = () => {
  const router = useRouter();
  const { returnRoute } = useTicketInstanceStore((state) => ({
    returnRoute: state.returnRoute,
  }));

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      px={2}
      borderBottom='1px solid'
      borderColor={Colors.COLOR_5}
    >
      <Typography variant='h2' color='primary'>
        Thanks for your order!
      </Typography>
      <IconButton
        edge='end'
        color='inherit'
        onClick={() => router.push(returnRoute)}
        aria-label='close'
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default Header;
