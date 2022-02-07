import { useState, useEffect, Fragment, ReactNode } from 'react';
import { Button, Divider, TextField, Typography, makeStyles, Grid } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useAuth, useDialog } from 'src/hooks';
import { CustomDialog, CustomLabel, CustomSelect, MoreIconMenu, PageWrapper } from 'src/components';
import { MoreIconMenuItemProps } from 'src/components/moreIconMenu';
import { ApiRoutes, Colors } from 'src/constants';
import { BandMember, BaseResponse, PagePermission, SetDialogProps } from 'src/types';
import { useSnackbar } from 'notistack';
import { Api, Formatter } from 'src/utils';
import APP_PERMISSIONS from 'src/constants/permissions';

const useStyles = makeStyles((theme) => ({
  btnAdd: {
    padding: '13px 14px'
  },
  centeredDiv: {
    display: 'flex',
    alignItems: 'center'
  },
  columnHeader: {
    fontSize: '.7rem',
    paddingTop: 10
  },
  divider: {
    paddingBottom: 20,
    paddingTop: '25px !important'
  },
  smallFont: {
    [theme.breakpoints.down('md')]: {
      fontSize: '.7rem',
      wordBreak: 'break-word'
    }
  },
  memberName: {
    fontSize: '.8rem',
    fontWeight: 500
  },
  optionButton: {
    paddingTop: 0
  },
  tag: {
    background: Colors.TERTIARY,
    borderRadius: 5,
    color: 'white',
    fontSize: '.8rem',
    padding: '10px 20px 12px 20px',
    width: 'fit-content'
  }
}));

enum MemberSortBy {
  DATE_CREATED,
  NAME
}

const OPTIONS: ReactNode[] = [
  <option key={MemberSortBy.NAME} value={MemberSortBy.NAME}>Name</option>,
  <option key={MemberSortBy.DATE_CREATED} value={MemberSortBy.DATE_CREATED}>Date created</option>,
];

type SettingsProps = {
  bandId: string;
  response: BaseResponse<BandMember[]>
} & PagePermission;

const Settings = ({
  bandId,
  response,
  requiredPermissions = [
    APP_PERMISSIONS.Bands.Settings.View,
  ]
}: SettingsProps) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [memberEmail, setMemberEmail] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const { showDialog } = useDialog();
  const [members, setMembers] = useState<BandMember[]>();
  const [sortBy, setSortBy] = useState<MemberSortBy>(MemberSortBy.NAME);

  useEffect(() => {
    const { data, message, success } = response;
    if (success) {
      setMembers(data);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
    }
  }, []);

  const loadMembers = async () => {
    const membersResponse: BaseResponse<BandMember[]> = await Api.get(ApiRoutes.BandMembers.List(bandId));
    const { data, message, success } = membersResponse;
    if (success) {
      setMembers(data);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const addUser = async () => {
    if (!memberEmail) { enqueueSnackbar('Email is required!', { variant: 'error' }); } else {
      const request: BandMember = {
        bandId,
        email: memberEmail
      };

      const addUserResponse: BaseResponse = await Api.post(ApiRoutes.BandMembers.AddUser, request);
      const { message, success } = addUserResponse;
      if (success) {
        setShowAddUser(false);
        loadMembers();
      } else { enqueueSnackbar(message, { variant: 'error' }); }
    }
  };

  const renderAddUser = () => (
    <CustomDialog
      open={showAddUser}
      title='Add a new member'
      text=''
      closeDialogFunc={async () => setShowAddUser(false)}
      cancelText='Cancel'
      submitText='Create'
      submitHandler={async () => addUser()}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}><CustomLabel title='Member email' /></Grid>
        <Grid item xs={12}>
          <TextField value={memberEmail} onChange={(e) => { setMemberEmail(e.target.value); }} />
        </Grid>
      </Grid>
    </CustomDialog>
  );

  const confirmDelete = async (id: string) => {
    const dialogProps: SetDialogProps = {
      title: 'Do you want to delete this member?',
      text: 'This action is irreversible.',
      submitText: 'Delete',
      submitHandler: async () => {
        const deleteResponse = await Api.delete(ApiRoutes.BandMembers.Delete(id));
        const { message, success } = deleteResponse;
        if (success) {
          loadMembers();
        } else { enqueueSnackbar(message, { variant: 'error' }); }
      },
      cancelText: 'Cancel',
    };
    showDialog(dialogProps);
  };

  const renderOptionsMenu = (id: string) => {
    const menuItems: MoreIconMenuItemProps[] = [
      {
        Icon: <Delete fontSize='small' />,
        title: 'Delete',
        handleClick: async () => confirmDelete(id)
      }
    ];

    return <MoreIconMenu cssClass={classes.optionButton} items={menuItems} />;
  };

  const renderOptionsIfShould = (member: BandMember) => {
    const { isValidated, userId } = member;
    if (!isValidated || userId === user.id) { return null; }
    return renderOptionsMenu(member.id);
  };

  const renderHeader = () => (
    <>
      {renderAddUser()}
      <Grid item xs={6} md={4} className={classes.centeredDiv}><Typography variant='h1'>Settings</Typography></Grid>
      <Grid item sx={{ display: { xs: 'none', md: 'block' } }} md={3} lg={2} xl={4} />
      <Grid item xs={6} md={2} lg={3} xl={2}><Button onClick={() => setShowAddUser(true)} variant='contained' className={classes.btnAdd} fullWidth>Add User</Button></Grid>
      <Grid item xs={12} md={3} lg={3} xl={2}><CustomSelect value={sortBy} handleChange={(newValue) => setSortBy(newValue)} options={OPTIONS} /></Grid>
    </>
  );

  const renderColumnsHeader = () => (
    <>
      <Grid item xs={4} lg={4}><Typography className={classes.columnHeader} variant='body2' color='primary'>Full Name</Typography></Grid>
      <Grid item xs={4} lg={4}><Typography className={classes.columnHeader} variant='body2' color='primary'>Email Address</Typography></Grid>
      <Grid item xs={4} sx={{ display: { xs: 'none', md: 'block' } }} lg={3}><Typography className={classes.columnHeader} variant='body2' color='primary'>Date Created</Typography></Grid>
      <Grid item lg={1} />
    </>
  );

  const switchNameAndPending = (member: BandMember) => {
    if (member.isValidated) {
      return member.name;
    }
    return '(Pending validation)';
  };

  const renderMemberRow = (member: BandMember) => {
    const { email, dateCreated } = member;
    return (
      <Fragment key={email}>
        <Grid xs={12} className={classes.divider} item><Divider /></Grid>
        <Grid className={classes.smallFont} item xs={4} lg={4}>{switchNameAndPending(member)}</Grid>
        <Grid className={classes.smallFont} item xs={7} lg={4}>{email}</Grid>
        <Grid className={classes.smallFont} sx={{ display: { xs: 'none', md: 'block' } }} item xs={4} lg={3}>{Formatter.formatDate(dateCreated)}</Grid>
        <Grid item xs={1}>{renderOptionsIfShould(member)}</Grid>
      </Fragment>
    );
  };

  const renderBandMemberRows = () => (members && members.length > 0 ? members.map((el) => renderMemberRow(el)) : null);

  const renderTag = () => (
    <Grid item xs={12}>
      <div className={classes.tag}>Users</div>
    </Grid>
  );

  const renderMembersTable = () => {
    if (members && members.length > 0) {
      return (
        <>
          {renderTag()}
          {renderColumnsHeader()}
          {renderBandMemberRows()}
        </>
      );
    }
    return <Grid item xs={12}><Typography variant='body1'>No band members yet.</Typography></Grid>;
  };

  return (
    <PageWrapper title='Band Settings'>
      <Grid container spacing={2}>
        {renderHeader()}
        {renderMembersTable()}
      </Grid>
    </PageWrapper>
  );
};

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;
  const response: BaseResponse<BandMember[]> = await Api.get(ApiRoutes.BandMembers.List(id), ctx);
  return {
    props: {
      bandId: id,
      response,
      requiredPermissions: [
        APP_PERMISSIONS.Bands.Settings.View,
      ]
    }
  };
}

export default Settings;
