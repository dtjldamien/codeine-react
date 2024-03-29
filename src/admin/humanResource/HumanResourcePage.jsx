import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
import Grid from "@material-ui/core/Grid";
import Toast from "../../components/Toast.js";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 580,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  tabs: {
    backgroundColor: "#00000000",
    fontWeight: "800",
  },
  appbar: {
    backgroundColor: "#00000000",
    boxShadow: "none",
    marginBottom: "20px",
  },
  tabPanel: {
    padding: "0px",
  },
  avatar: {
    fontSize: "50px",
    width: "100px",
    height: "100px",
  },
  orgavatar: {
    objectFit: "contain",
  },
  border: {
    border: "1px solid",
    borderRadius: "5px",
    borderColor: "#437FC7",
    marginTop: "15px",
    padding: "10px",
  },
  dataGrid: {
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
  profileLink: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  pro: {
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AdminHumanResourcePage = () => {
  const classes = styles();

  //Toast message
  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  const formatStatus = (status) => {
    if (status) {
      return "Active";
    } else {
      return "Deactivated";
    }
  };

  const formatNull = (input) => {
    if (input) {
      if (input.organization_name) {
        return input.organization_name;
      }
      return input;
    } else {
      return "-";
    }
  };

  useEffect(() => {
    getMemberData();
    getPartnerData();
    getAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Member data
  const [allMembersList, setAllMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
    membership_tier: "",
  });

  const memberColumns = [
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    { field: "first_name", headerName: "First name", width: 130 },
    { field: "last_name", headerName: "Last name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 160,
    },
    {
      width: 200,
      headerName: "Membership Tier",
      field: "membership_tier",
      hidden: true,
    },
  ];

  let memberRows = allMembersList;
  const [searchValueMember, setSearchValueMember] = useState("");

  const getMemberData = () => {
    let queryParams = {
      search: searchValueMember,
    };
    let active = "active";
    let deactived = "deactivated";
    if (searchValueMember !== "") {
      if (active.includes(searchValueMember.toLowerCase())) {
        queryParams = {
          is_active: true,
        };
      } else if (deactived.includes(searchValueMember.toLowerCase())) {
        queryParams = {
          is_active: false,
        };
      } else {
        queryParams = {
          search: searchValueMember,
        };
      }
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`, { params: { ...queryParams } })
        .then((res) => {
          // console.log(res.data);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              id: res.data[i].id,
              first_name: res.data[i].first_name,
              last_name: res.data[i].last_name,
              email: res.data[i].email,
              is_active: res.data[i].is_active,
              date_joined: res.data[i].date_joined,
              profile_photo: res.data[i].profile_photo,
              membership_tier: res.data[i].member.membership_tier,
            };
            arr.push(obj);
          }

          setAllMemberList(arr);
          memberRows = allMembersList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handleMemberStatus = (e, status, memberid) => {
    e.preventDefault();
    if (status) {
      Service.client
        .patch(`/auth/members/${memberid}/suspend`, { is_suspended: true })
        .then(() => {
          Service.client
            .delete(`auth/members/${memberid}`)
            .then(() => {
              Service.client
                .get(`auth/members/${memberid}`)
                .then((res1) => {
                  setSbOpen(true);
                  setSnackbar({
                    ...snackbar,
                    message: "Member is deactivated",
                    severity: "success",
                  });
                  setSelectedMember(res1.data);
                  getMemberData();
                })
                .catch();
            })
            .catch();
        })
        .catch();
    } else {
      Service.client
        .post(`/auth/members/${memberid}/activate`)
        .then((res) => {
          Service.client
            .patch(`/auth/members/${memberid}/suspend`, {
              is_suspended: false,
            })
            .then(() => {
              setSbOpen(true);
              setSnackbar({
                ...snackbar,
                message: "Member is activated",
                severity: "success",
              });
              setSelectedMember(res.data);
              getMemberData();
            })
            .catch();
        })
        .catch();
    }
  };

  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  const handleClickOpenMember = (e) => {
    setSelectedMember(e.row);
    setOpenMemberDialog(true);
  };

  const handleCloseMember = () => {
    setOpenMemberDialog(false);
  };

  // Partner
  const [allPartnerList, setAllPartnerList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
    partner: {
      job_title: "",
      bio: "",
      organization: {
        organization_name: "",
        organization_photo: "",
      },
    },
  });

  const partnerColumns = [
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    {
      field: "first_name",
      headerName: "First name",
      width: 130,
      valueFormatter: (params) => formatNull(params.value),
    },
    {
      field: "last_name",
      headerName: "Last name",
      width: 130,
      valueFormatter: (params) => formatNull(params.value),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 160,
    },
    {
      field: "partner",
      headerName: "Organisation",
      valueFormatter: (params) => formatNull(params.value.organization),
      width: 160,
    },
  ];

  let partnerRows = allPartnerList;

  const getPartnerData = () => {
    let queryParams = {
      search: searchValuePartner,
    };
    let active = "active";
    let deactived = "deactivated";
    if (searchValuePartner !== "") {
      if (active.includes(searchValuePartner.toLowerCase())) {
        queryParams = {
          is_active: true,
        };
      } else if (deactived.includes(searchValuePartner.toLowerCase())) {
        queryParams = {
          is_active: false,
        };
      } else {
        queryParams = {
          search: searchValuePartner,
        };
      }
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/partners`, { params: { ...queryParams } })
        .then((res) => {
          setAllPartnerList(res.data);
          partnerRows = allPartnerList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handlePartnerStatus = (e, status, partnerid) => {
    if (status) {
      Service.client.delete(`/auth/partners/${partnerid}`).then((res) => {
        Service.client
          .patch(`/auth/partners/${partnerid}/suspend`, {
            is_suspended: true,
          })
          .then(() => {
            Service.client
              .get(`/auth/partners/${partnerid}`)
              .then((res) => {
                setSelectedPartner(res.data);
                setSbOpen(true);
                setSnackbar({
                  ...snackbar,
                  message: "Partner is deactivated",
                  severity: "success",
                });
              })
              .catch();
          })
          .catch();
        getPartnerData();
      });
    } else {
      Service.client
        .post(`/auth/partners/${partnerid}/activate`)
        .then((res) => {
          Service.client
            .patch(`/auth/partners/${partnerid}/suspend`, {
              is_suspended: false,
            })
            .then(() => {
              setSbOpen(true);
              setSnackbar({
                ...snackbar,
                message: "Partner is activated",
                severity: "success",
              });
              setSelectedPartner(res.data);
              getPartnerData();
            })
            .catch();
        })
        .catch();
    }
  };

  const [searchValuePartner, setSearchValuePartner] = useState("");
  const [openPartnerDialog, setOpenPartnerDialog] = useState(false);

  const handleClickOpenPartner = (e) => {
    setSelectedPartner(e.row);
    setOpenPartnerDialog(true);
  };

  const handleClosePartner = () => {
    setOpenPartnerDialog(false);
  };

  // Admin
  const [allAdminList, setAllAdminList] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
  });

  const adminColumns = [
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    {
      field: "first_name",
      headerName: "First name",
      valueFormatter: (params) => formatNull(params.value),
      width: 130,
    },
    {
      field: "last_name",
      headerName: "Last name",
      valueFormatter: (params) => formatNull(params.value),
      width: 130,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 160,
    },
  ];

  const adminRows = allAdminList;

  for (var j = 0; j < allAdminList.length; j++) {
    adminRows[j].date_joined = formatDate(allAdminList[j].date_joined);
    adminRows[j].first_name = allAdminList[j].first_name
      ? allAdminList[j].first_name
      : "-";
    adminRows[j].last_name = allAdminList[j].last_name
      ? allAdminList[j].last_name
      : "-";
  }

  const getAdminData = () => {
    let queryParams = {
      search: searchValueAdmin,
    };
    let active = "active";
    let deactived = "deactivated";
    if (searchValueAdmin !== "") {
      if (active.includes(searchValueAdmin.toLowerCase())) {
        queryParams = {
          is_active: true,
        };
      } else if (deactived.includes(searchValueAdmin.toLowerCase())) {
        queryParams = {
          is_active: false,
        };
      } else {
        queryParams = {
          search: searchValueAdmin,
        };
      }
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/admins`, { params: { ...queryParams } })
        .then((res) => {
          setAllAdminList(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const [searchValueAdmin, setSearchValueAdmin] = useState("");
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

  const handleClickOpenAdmin = (e) => {
    setSelectedAdmin(e.row);
    setOpenAdminDialog(true);
  };

  const handleCloseAdmin = () => {
    setOpenAdminDialog(false);
  };

  useEffect(() => {
    if (searchValueAdmin === "") {
      getAdminData();
    }
    if (searchValueMember === "") {
      getMemberData();
    }
    if (searchValuePartner === "") {
      getPartnerData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValueMember, searchValueAdmin, searchValuePartner]);

  const handleProfileLink = (m) => {
    if (m.membership_tier === "PRO") {
      return `/${m.unique_id}`;
    }
  };

  const toRenderProfileLinkOrNot = (m) => {
    if (m.membership_tier === "PRO") {
      return true;
    }

    return false;
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <AppBar
        position="static"
        classes={{
          root: classes.appbar,
        }}
      >
        <Tabs
          value={value}
          indicatorColor="secondary"
          textColor="secondary"
          onChange={handleChange}
          aria-label="simple tabs example"
          classes={{
            root: classes.tabs,
          }}
        >
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Partners" {...a11yProps(1)} />
          <Tab label="Admin" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* Members Tab */}
      <TabPanel value={value} index={0}>
        <Grid container>
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
                elavation: "0px",
              }}
              placeholder="Search members"
              value={searchValueMember}
              onChange={(newValue) => setSearchValueMember(newValue)}
              onCancelSearch={() => setSearchValueMember("")}
              onRequestSearch={getMemberData}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
          >
            <DataGrid
              className={classes.dataGrid}
              rows={memberRows}
              columns={memberColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              //checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenMember(e)}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openMemberDialog}
          onClose={handleCloseMember}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Member Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseMember}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                {toRenderProfileLinkOrNot(selectedMember) ? (
                  <a
                    href={handleProfileLink(selectedMember)}
                    style={{ textDecoration: "none" }}
                  >
                    {selectedMember.profile_photo ? (
                      <Avatar
                        src={selectedMember.profile_photo}
                        alt=""
                        className={classes.avatar}
                      />
                    ) : (
                      <Avatar className={classes.avatar}>
                        {selectedMember.email.charAt(0)}
                      </Avatar>
                    )}
                  </a>
                ) : selectedMember.profile_photo ? (
                  <Avatar
                    src={selectedMember.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedMember.email.charAt(0)}
                  </Avatar>
                )}
              </Grid>
              <Grid item xs={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontSize: "20px" }}>
                    {toRenderProfileLinkOrNot(selectedMember) ? (
                      <a
                        href={handleProfileLink(selectedMember)}
                        className={classes.profileLink}
                      >
                        <strong>
                          {selectedMember.first_name} {selectedMember.last_name}{" "}
                        </strong>
                      </a>
                    ) : (
                      <strong>
                        {selectedMember.first_name} {selectedMember.last_name}{" "}
                      </strong>
                    )}
                  </div>
                  {selectedMember && selectedMember.membership_tier === "PRO" && (
                    <div style={{ marginTop: "4px" }}>
                      <Typography variant="subtitle1" className={classes.pro}>
                        PRO
                      </Typography>
                    </div>
                  )}
                  {selectedMember.is_active ? (
                    <div style={{ color: "green" }}>{"\u00A0"}(Active) </div>
                  ) : (
                    <div style={{ color: "red" }}>{"\u00A0"}(Deactived)</div>
                  )}
                </div>
                <div style={{ color: "black" }}>
                  {selectedMember.email} <br />
                </div>
                <div
                  style={{ fontSize: "14px", marginTop: "0px", color: "black" }}
                >
                  Joined on {formatDate(selectedMember.date_joined)}
                </div>
                <div style={{ fontSize: "12px", marginTop: "5px" }}>
                  ID: {selectedMember.id}
                </div>
              </Grid>
            </Grid>
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) =>
                handleMemberStatus(
                  e,
                  selectedMember.is_active,
                  selectedMember.id
                )
              }
              style={{
                margin: "10px 15px",
                borderColor: selectedMember.is_active ? "#E12424" : "green",
                color: selectedMember.is_active ? "#E12424" : "green",
              }}
              variant="outlined"
            >
              {selectedMember.is_active ? (
                <div style={{ color: "red" }}>Deactivate</div>
              ) : (
                <div style={{ color: "green" }}>Activate</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Partners Tab */}
      <TabPanel value={value} index={1}>
        <Grid container>
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
              }}
              placeholder="Search partners"
              value={searchValuePartner}
              onChange={(newValue) => setSearchValuePartner(newValue)}
              onRequestSearch={getPartnerData}
              onCancelSearch={() => setSearchValuePartner("")}
            />
          </Grid>
          <Grid item xs={3}>
            {/* <Button variant="contained" color="primary">
              Email Selected Partners
            </Button> */}
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
          >
            <DataGrid
              className={classes.dataGrid}
              rows={partnerRows}
              columns={partnerColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenPartner(e)}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openPartnerDialog}
          onClose={handleClosePartner}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Partner Detail
            {selectedPartner.partner.organization ? (
              <Typography style={{ color: "blue" }}>
                Enterprise Account
              </Typography>
            ) : (
              <Typography style={{ color: "blue" }}>
                Personal Account
              </Typography>
            )}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClosePartner}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div>
              <Grid container>
                <Grid item xs={2}>
                  {selectedPartner.profile_photo ? (
                    <Avatar
                      src={selectedPartner.profile_photo}
                      alt=""
                      className={classes.avatar}
                    />
                  ) : (
                    <Avatar className={classes.avatar}>
                      {selectedPartner.email.charAt(0)}
                    </Avatar>
                  )}
                </Grid>
                <Grid item xs={10}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography style={{ fontSize: "20px" }}>
                      <strong>
                        {selectedPartner.first_name} {selectedPartner.last_name}{" "}
                      </strong>
                    </Typography>
                    {selectedPartner.is_active ? (
                      <Typography style={{ color: "green" }}>
                        {"\u00A0"}(Active){" "}
                      </Typography>
                    ) : (
                      <Typography style={{ color: "red" }}>
                        {"\u00A0"}(Deactived)
                      </Typography>
                    )}
                  </div>
                  <Typography style={{ color: "black" }}>
                    {selectedPartner.email} <br />
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "14px",
                      marginTop: "0px",
                      color: "black",
                    }}
                  >
                    Joined on {formatDate(selectedPartner.date_joined)}
                  </Typography>
                  <Typography style={{ fontSize: "12px", marginTop: "5px" }}>
                    ID: {selectedPartner.id}
                  </Typography>
                </Grid>
              </Grid>
              {selectedPartner.partner.organization && (
                <Grid container className={classes.border}>
                  <Grid item xs={12} style={{ marginBottom: "10px" }}>
                    <Typography style={{ fontSize: "16spx" }}>
                      <strong>Organisation Details</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Fragment>
                      {selectedPartner.partner.organization
                        .organization_photo ? (
                        <Avatar
                          src={
                            selectedPartner.partner.organization
                              .organization_photo
                          }
                          alt=""
                          className={classes.avatar}
                          classes={{
                            img: classes.orgavatar,
                          }}
                        />
                      ) : (
                        <Avatar className={classes.avatar}>
                          {selectedPartner.partner.organization.organization_name.charAt(
                            0
                          )}
                        </Avatar>
                      )}
                    </Fragment>
                  </Grid>
                  <Grid item xs={10}>
                    {selectedPartner.partner.organization && (
                      <div>
                        <Typography>
                          <strong>{selectedPartner.partner.job_title}</strong>
                          {"\u00A0"}@{" "}
                          <strong>
                            {
                              selectedPartner.partner.organization
                                .organization_name
                            }
                          </strong>
                        </Typography>
                        <Typography style={{ color: "#437FC7" }}>
                          <strong>Bio</strong>
                        </Typography>
                        {selectedPartner.partner.bio}
                      </div>
                    )}
                  </Grid>
                </Grid>
              )}
            </div>
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) =>
                handlePartnerStatus(
                  e,
                  selectedPartner.is_active,
                  selectedPartner.id
                )
              }
              style={{
                margin: "10px 15px",
                borderColor: selectedPartner.is_active ? "#E12424" : "green",
                color: selectedPartner.is_active ? "#E12424" : "green",
              }}
              variant="outlined"
            >
              {selectedPartner.is_active ? (
                <div style={{ color: "red" }}>Deactivate</div>
              ) : (
                <div style={{ color: "green" }}>Activate</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Admin Tab */}
      <TabPanel value={value} index={2}>
        <Grid container>
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
              }}
              placeholder="Search admin"
              value={searchValueAdmin}
              onChange={(newValue) => setSearchValueAdmin(newValue)}
              onRequestSearch={getAdminData}
              onCancelSearch={() => setSearchValueAdmin("")}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
          >
            <DataGrid
              className={classes.dataGrid}
              rows={adminRows}
              columns={adminColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              //checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenAdmin(e)}
            />
          </Grid>
        </Grid>
        <Dialog
          open={openAdminDialog}
          onClose={handleCloseAdmin}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Admin Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseAdmin}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                {selectedAdmin.profile_photo ? (
                  <Avatar
                    src={selectedAdmin.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedAdmin.email.charAt(0)}
                  </Avatar>
                )}
              </Grid>
              <Grid item xs={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography style={{ fontSize: "20px" }}>
                    <strong>
                      {selectedAdmin.first_name} {selectedAdmin.last_name}{" "}
                    </strong>
                  </Typography>
                  {selectedAdmin.is_active ? (
                    <Typography style={{ color: "green" }}>
                      {"\u00A0"}(Active){" "}
                    </Typography>
                  ) : (
                    <Typography style={{ color: "red" }}>
                      {"\u00A0"}(Deactived)
                    </Typography>
                  )}
                </div>
                <Typography style={{ color: "black" }}>
                  {selectedAdmin.email} <br />
                </Typography>
                <Typography
                  style={{ fontSize: "14px", marginTop: "0px", color: "black" }}
                >
                  Joined on {formatDate(selectedAdmin.date_joined)}
                </Typography>
                <Typography style={{ fontSize: "12px", marginTop: "5px" }}>
                  ID: {selectedAdmin.id}
                </Typography>
                <br />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </TabPanel>
    </Fragment>
  );
};

export default AdminHumanResourcePage;
