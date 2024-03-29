import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  ListItem,
  Typography,
  Popover,
  Badge,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import ZeroNotif from "../assets/ZeroNotif.svg";
import NotifTile from "../components/NotificationTile";
import NotificationsIcon from "@material-ui/icons/Notifications";
import logo from "../assets/codeineLogos/Partner.svg";
import DoneAllIcon from "@material-ui/icons/DoneAll";

const useStyles = makeStyles((theme) => ({
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

const PartnerNavbar = ({}) => {
  const classes = useStyles();
  const history = useHistory();

  const [notificationList, setNotificationList] = useState([]);

  const getUserNotifications = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get("/notification-objects", {
          timeout: 20000,
        })
        .then((res) => {
          console.log(res);
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

  useEffect(() => {
    getUserNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div>
      <Navbar logo={navLogo} navbarItems={loggedInNavbar} bgColor="#fff" />
    </div>
  );
};

export default PartnerNavbar;
