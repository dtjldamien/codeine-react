import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import {
  BrowserRouter,
  Link,
  NavLink,
  Redirect,
  Switch,
  useHistory,
} from "react-router-dom";
import PrivateRoute from "../components/routes/PrivateRoute";
import {
  Avatar,
  Button,
  ListItem,
  Typography,
  Popover,
  Badge,
  Divider,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Sidebar from "../components/Sidebar";
import { AttachMoney, Dashboard, NoteAdd, Timeline } from "@material-ui/icons";
import PaymentIcon from "@material-ui/icons/Payment";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faFileCode } from "@fortawesome/free-solid-svg-icons";
import Toast from "../components/Toast.js";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import logo from "../assets/codeineLogos/Partner.svg";
import IndustryProject from "./industryProject/IndustryProject";
import ZeroNotif from "../assets/ZeroNotif.svg";
import NotifTile from "../components/NotificationTile";
import Consultation from "./consultation/Consultation";
import ViewAllCourses from "./course/ViewAllCourses";
import CourseCreation from "./course/CourseCreation";
import ViewCourseDetailsPage from "./course/ViewCourseDetailsPage";
import ViewArticlePage from "./article/ContentProviderArticleList";
import Password from "./password/PasswordPage";
import Profile from "./profile/ProfilePage";
import Article from "./article/ContentProviderArticleList";
import SubjectIcon from "@material-ui/icons/Subject";
import Helpdesk from "./helpdesk/HelpdeskPage";
import Wallet from "./wallet/WalletPage";
import Student from "./student/StudentPage";
import DashboardPage from "./dashboard/DashboardPage";
import ContributionsPage from "./contributions/ContributionsPage";
import ReplyToComments from "./course/ReplyToComments";
import ViewAllQuizzes from "./course/ViewAllQuizzes";
import CourseDetailAnalytics from "./dashboard/CourseDetailAnalytics";
import CourseSearchRanking from "./dashboard/CourseSearchRanking";
import IndustryProjectDetails from "./industryProject/IndustryProjectDetails";
import CreateNewTicketPage from "./helpdesk/CreateNewTicketPage";
import ViewSubmittedTicketsPage from "./helpdesk/ViewSubmittedTicketsPage";
import Notification from "./notification/NotificationManagement";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ViewTicketPage from "./helpdesk/ViewTicketPage";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  listItem: {
    width: "100%",
    padding: 10,
    color: "#6e6e6e",
    borderLeft: "5px solid #fff",
    "&:hover": {
      backgroundColor: "#F4F4F4",
      borderLeft: "5px solid #F4F4F4",
    },
  },
  listIcon: {
    marginLeft: "15px",
    marginRight: "20px",
  },
  activeLink: {
    width: "100%",
    padding: 10,
    color: theme.palette.primary.main,
    backgroundColor: "#F4F4F4",
    borderLeft: "5px solid",
    "& p": {
      fontWeight: 600,
    },
    "&:hover": {
      borderLeft: "5px solid #437FC7",
    },
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    fontSize: "30px",
  },
  mainPanel: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(12),
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    width: "calc(100% - 240px)",
    marginLeft: "240px",
  },
  subheader: {
    // textAlign: "center",
    paddingLeft: theme.spacing(4),
    paddingTop: "20px",
    paddingBottom: "10px",
    opacity: 0.9,
    fontWeight: 600,
    textTransform: "uppercase",
    // color: theme.palette.primary.main,
  },
  notifpopover: {
    width: "400px",
    padding: theme.spacing(1),
  },
  notification: {
    cursor: "pointer",
    color: "#878787",
    height: "30px",
    width: "30px",
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  notificationOpen: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    height: "30px",
    width: "30px",
  },
  viewallnotif: {
    textAlign: "center",
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
      color: theme.palette.primary.main,
    },
  },
}));

const ContentProviderHome = () => {
  const classes = useStyles();
  const history = useHistory();

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

  const [user, setUser] = useState({
    first_name: "Member",
    email: "Member panel",
    profile_photo: "",
  });

  const [notificationList, setNotificationList] = useState([]);

  const getUserNotifications = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get("/notification-objects")
        .then((res) => {
          setNotificationList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const [anchorE2, setAnchorE2] = useState(null);

  const handleNotifClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorE2(null);
  };

  const notifOpen = Boolean(anchorE2);
  const notifid = notifOpen ? "simple-popover" : undefined;

  const markAllAsRead = () => {
    Service.client
      .patch(`/notification-objects/mark/all-read`)
      .then((res) => {
        setNotificationList(res.data);
      })
      .catch();
  };

  const notifBell = (
    <div>
      <Badge
        badgeContent={
          notificationList.length > 0 ? notificationList[0].num_unread : 0
        }
        color="primary"
      >
        <NotificationsIcon
          className={
            notifOpen ? classes.notificationOpen : classes.notification
          }
          onClick={handleNotifClick}
        />
      </Badge>

      <Popover
        id={notifid}
        open={notifOpen}
        anchorEl={anchorE2}
        onClose={handleNotifClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ maxHeight: "70%" }}
      >
        <div className={classes.notifpopover}>
          <div style={{ display: "flex" }}>
            <Typography
              style={{
                fontWeight: "800",
                fontSize: "25px",
                marginLeft: "10px",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              Notifications
            </Typography>

            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Mark all as read">
                <IconButton
                  onClick={() => {
                    markAllAsRead();
                  }}
                >
                  <DoneAllIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {notificationList.slice(0, 20).map((notification, index) => {
            return (
              <NotifTile
                key={index}
                notification={notification}
                getUserNotifications={getUserNotifications}
                userType="partner"
              />
            );
          })}
          {notificationList.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <img src={ZeroNotif} alt="" />
              <Typography style={{ fontWeight: "700", marginTop: "20px" }}>
                All caught up!
              </Typography>
            </div>
          )}
        </div>
        <div
          style={{
            backgroundColor: "#dbdbdb",
            position: "sticky",
            bottom: 0,
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Typography
            className={classes.viewallnotif}
            onClick={() => {
              //alert("clicked on view all notifications");
              history.push("/partner/notifications");
            }}
          >
            View all
          </Typography>
        </div>
      </Popover>
    </div>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>{notifBell}</ListItem>
      {/* <ListItem style={{ whiteSpace: "nowrap" }}>
        <a href={`/codereview`} style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            style={{ textTransform: "capitalize" }}
            color="primary"
          >
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#437FC7" }}
            >
              Code Review
            </Typography>
          </Button>
        </a>
      </ListItem> */}
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            history.push("/partner");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Log Out
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const sidebarHead = (
    <Fragment>
      <div style={{ marginTop: "30px", marginBottom: "10px" }}>
        {user.profile_photo ? (
          <Avatar alt="" src={user.profile_photo} className={classes.avatar} />
        ) : (
          <Avatar className={classes.avatar}>
            {user.first_name.charAt(0)}
          </Avatar>
        )}
      </div>
      <Typography variant="h6">
        {user.first_name} {user.last_name}
      </Typography>
      {user && user.partner && !user.partner.organization && (
        <Typography variant="body1">{user.partner.job_title}</Typography>
      )}
      {user && user.partner && user.partner.organization && (
        <Typography variant="body1">
          {user.partner.organization.organization_name}
        </Typography>
      )}
    </Fragment>
  );

  const sidebarList = (
    <Fragment>
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            Navigation
          </Typography>
        </label>
      </div>
      <ListItem
        component={NavLink}
        to="/partner/home/dashboard"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="body1">Dashboard</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/content"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <InsertDriveFileIcon className={classes.listIcon} />
        <Typography variant="body1">Course</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/student"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <SchoolOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Student</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/consultation"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Timeline className={classes.listIcon} />
        <Typography variant="body1">Consultation</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/article"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <FontAwesomeIcon
          icon={faNewspaper}
          className={classes.listIcon}
          style={{ height: "24px", width: "24px" }}
        />
        <Typography variant="body1">Article</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/notification"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <NotificationsNoneIcon className={classes.listIcon} />
        <Typography variant="body1">Notification</Typography>
      </ListItem>
      {user && user.partner && user.partner.organization && (
        <ListItem
          component={NavLink}
          to="/partner/home/industryproject"
          activeClassName={classes.activeLink}
          className={classes.listItem}
          button
        >
          <WorkOutlineIcon className={classes.listIcon} />
          <Typography variant="body1">Industry Project</Typography>
        </ListItem>
      )}
      <ListItem
        component={NavLink}
        to="/partner/home/helpdesk"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <HelpOutlineOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Helpdesk</Typography>
      </ListItem>
      {/* <Divider /> */}
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            User Settings
          </Typography>
        </label>
      </div>
      <ListItem
        component={NavLink}
        to="/partner/home/profile"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PersonOutlineOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Profile</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/password"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <LockOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Password</Typography>
      </ListItem>
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            Transactions
          </Typography>
        </label>
      </div>
      {user && user.partner && user.partner.organization && (
        <ListItem
          component={NavLink}
          to="/partner/home/contributions"
          activeClassName={classes.activeLink}
          className={classes.listItem}
          button
        >
          <AttachMoney className={classes.listIcon} />
          <Typography variant="body1">Funding</Typography>
        </ListItem>
      )}
      <ListItem
        component={NavLink}
        to="/partner/home/earnings"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PaymentIcon className={classes.listIcon} />
        <Typography variant="body1">Earnings</Typography>
      </ListItem>
      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <a href="/codereview" style={{ textDecoration: "none" }}>
        <ListItem className={classes.listItem} button>
          <FontAwesomeIcon
            icon={faFileCode}
            className={classes.listIcon}
            style={{ height: "24px", width: "24px" }}
          />
          <Typography variant="body1">Code Review</Typography>
        </ListItem>
      </a>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/partner/home/dashboard"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" alt="" />
      </Link>
    </Fragment>
  );

  const getUserDetails = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      // console.log(decoded);
      Service.client
        .get(`/auth/partners/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);

          if (!res.data.partner) {
            history.push("/404");
          } else {
            setUser(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUserNotifications();
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(user);

  return (
    <BrowserRouter>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.root}>
        <Navbar logo={navLogo} navbarItems={loggedInNavbar} bgColor="#fff" />
        <Sidebar head={sidebarHead} list={sidebarList} />
        <div className={classes.mainPanel}>
          <Switch>
            <PrivateRoute
              exact
              path="/partner/home/dashboard"
              render={() => <DashboardPage />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/dashboard/search"
              render={() => <CourseSearchRanking />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/dashboard/:id"
              strict
              sensitive
              render={(match) => <CourseDetailAnalytics match={match} />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/content"
              render={() => <ViewAllCourses />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/article"
              render={() => (
                <Article
                  history={history}
                  snackbar={snackbar}
                  setSbOpen={setSbOpen}
                  setSnackbar={setSnackbar}
                />
              )}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/content/new"
              render={() => <CourseCreation />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/view/comments/:id"
              strict
              sensitive
              render={(match) => <ReplyToComments match={match} />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/view/quizzes/:id"
              strict
              sensitive
              render={(match) => <ViewAllQuizzes match={match} />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/view/:id"
              strict
              sensitive
              render={(match) => <ViewCourseDetailsPage match={match} />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/:id"
              strict
              sensitive
              render={(match) => <CourseCreation match={match} />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/student"
              render={() => <Student />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/consultation"
              render={() => <Consultation />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/industryproject"
              render={() => <IndustryProject />}
              user="partner"
            />
            <PrivateRoute
              strict
              sensitive
              path="/partner/home/industryproject/view/:id"
              render={() => <IndustryProjectDetails />}
            />
            <PrivateRoute
              path="/partner/home/notification"
              render={() => <Notification />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/helpdesk"
              render={() => <Helpdesk />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/helpdesk/contact-us"
              render={() => <CreateNewTicketPage />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/helpdesk/tickets"
              render={() => <ViewSubmittedTicketsPage />}
              user="partner"
            />
            <PrivateRoute
              strict
              sensitive
              path="/partner/home/helpdesk/tickets/:id"
              render={() => <ViewTicketPage />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/password"
              render={() => (
                <Password
                  snackbar={snackbar}
                  setSbOpen={setSbOpen}
                  setSnackbar={setSnackbar}
                />
              )}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/profile"
              render={() => <Profile profile={user} setProfile={setUser} />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/earnings"
              render={() => <Wallet />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/contributions"
              render={() => <ContributionsPage />}
              user="partner"
            />
            <Redirect from="/partner/home" to="/partner/home/dashboard" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default ContentProviderHome;
