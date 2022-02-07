import { ReactNode, useState } from 'react';
//import { useEffect } from "react";

import { Grid, Tab, Tabs, Box, makeStyles, Button, Typography } from '@material-ui/core';
import AddTicketButton from '../addTicketButton';
import TicketList from '../ticketList';
import AttendeesTab from './attendeesCheckIn/attendeesTab';

import type { Show } from 'src/types';
import { useDialog } from 'src/hooks';
import { SetDialogProps, BaseResponse } from 'src/types';
import api from 'src/utils/api';
import { ApiRoutes, UiRoutes } from 'src/constants';

import { useRouter } from 'next/router';
import { useTicketInstanceStore } from 'src/stores';
import { ProcessDoorTicketsIcon, AccessCodeIcon } from 'src/constants/icons';


const useStyles = makeStyles((theme) => ({
  rootTab: {
    '& .MuiTabs-indicator': {
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      width: '100%',
    },
  },
  doorManCheckoutButton: {
    paddingTop: theme.spacing(2)
  },
  tabItem: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 15,
    marginRight: 0,
    color: '#9A9A9A',
    minWidth: 'auto',
    '&.Mui-selected': {
      color: 'black',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  },
}));

enum TicketManagementTab {
  Tickets = 0,
  SalesReport,
  PayoutMethod,
  AttendeesCheckIn,
  DoorCheckout
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`ticket-management-tab-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={2}>{children}</Box>}
    </div>
  );
}

type ManagementProps = {
  bandId: string;
  show?: Show;
};

const Management = ({ bandId, show } : ManagementProps) => {

  const router = useRouter();
  const { 
      setShow, 
      setSquarePayment, 
      setSourceBandId, 
      setReturnRoute, 
      setContactInfo 
  } = useTicketInstanceStore((state) => ({
        setShow: state.setShow,
        setSquarePayment: state.setSquarePayment,
        setSourceBandId: state.setSourceBandId,
        setReturnRoute: state.setReturnRoute,
        setContactInfo: state.setContactInfo,
    })
  );

  const { closeDialog, showDialog } = useDialog();
  const showDetails = (description) => {
    const dialogProps: SetDialogProps = {
      title: 'Show Information',
      text: description,
      submitText: 'OK',
      submitHandler: async () => {
        closeDialog();
      },
      cancelText: null
    };
    showDialog(dialogProps);
  };

  const deviceCodeCreateClick = async (event) => {
    event.stopPropagation();
    const response: BaseResponse<string> = await api.get(ApiRoutes.DeviceCode.Code(show.id));
    showDetails(response.data);
  };

  const terminalCheckoutClick  = async (event) => {
    event.stopPropagation();
    setShow(show);
    setSquarePayment(true);
    setSourceBandId(bandId);
    setContactInfo({email:'', phoneNumber:'', acceptTerms:false});
    const currentRoute = router.asPath;
    setReturnRoute(currentRoute);
    router.push(UiRoutes.Tickets.Order);
  };

  const [selectedTab, changeTab] = useState<TicketManagementTab>(
    TicketManagementTab.Tickets
  );

  const classes = useStyles();
  const tabs = () => (
    <>
      <Grid item xs={12}>
        <Box>
          <Tabs
            value={selectedTab}
            className={classes.rootTab}
            onChange={(e, newValue) => changeTab(newValue)}
            aria-label='Ticket management tabs'
            variant='scrollable'
          >
            <Tab
              disableRipple
              className={classes.tabItem}
              label='Tickets'
            />
            <Tab
              disabled
              disableRipple
              className={classes.tabItem}
              label='Sales Report'
            />
            <Tab
              disabled
              disableRipple
              className={classes.tabItem}
              label='Payout Method'
            />
            <Tab
              disableRipple
              className={classes.tabItem}
              label='Attendees Check-in'
            />
            <Tab
              disableRipple
              className={classes.tabItem}
              label='Door Checkout'
            />
          </Tabs>
          <TabPanel
            value={selectedTab}
            index={TicketManagementTab.Tickets}
          >
            <TicketList />
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              width='100%'
            >
              <AddTicketButton />
            </Box>
          </TabPanel>
          <TabPanel
            value={selectedTab}
            index={TicketManagementTab.AttendeesCheckIn}
          >
            <AttendeesTab />
          </TabPanel>
          <TabPanel
            value={selectedTab}
            index={TicketManagementTab.DoorCheckout}
          >
            <Box
              display='flex'
              height='230px'
              width='100%'
              alignItems='center'
              justifyContent='space-between'
              className={classes.doorManCheckoutButton}
              flexDirection='column'
            >
              <img alt='MicCheck Request Access Code' src={AccessCodeIcon} />
              <Typography variant='h2'>Access Code Required</Typography>
              <Typography variant='body1'>Request access code to sync with your Square terminal</Typography>
              <a href='#' onClick={(e) => deviceCodeCreateClick(e)} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                    Get Terminal Code
                </Button>
              </a>
            </Box>
            <br />

            <Box
              display='flex'
              height='230px'
              width='100%'
              alignItems='center'
              justifyContent='space-between'
              className={classes.doorManCheckoutButton}
              flexDirection='column'
            >
              <img alt='MicCheck Process door tickets' src={ProcessDoorTicketsIcon} />
              <Typography variant='h2'>Process door tickets</Typography>
              <Typography variant='body1'>Click the button to proceed</Typography>

              <a href='#' onClick={(e) => terminalCheckoutClick(e)} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Launch POS Terminal
                </Button>
              </a>
            </Box>

            <br />

            {/* <div style={{fontFamily: 'Lucida Console'}} dangerouslySetInnerHTML={{__html: logSquare}}>
            </div> */}

          </TabPanel>
        </Box>
      </Grid>
    </>
  );

  return tabs();
};

export default Management;
