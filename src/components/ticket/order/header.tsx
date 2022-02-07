import { Box, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/close';
import { useRouter } from 'next/router';
import GrayDivider from './grayDivider';
import ShowInfo from './showInfo';

import { useTicketInstanceStore } from 'src/stores';

const Header = () => {
  const router = useRouter();
  const { setPaymentDetails, clearOrder } = useTicketInstanceStore((state) => ({
    setPaymentDetails: state.setPaymentDetails,
    clearOrder: state.clearOrder
  }));
  
  const handleClick = () => {
    setPaymentDetails(null);
    clearOrder();
    router.back();
  };

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        width='100%'
        padding={2}
        justifyContent='space-between'
      >

        <ShowInfo />
        <IconButton
          edge='end'
          color='inherit'
          onClick={handleClick}
          aria-label='close'
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <GrayDivider />
    </>
  );
};

export default Header;
