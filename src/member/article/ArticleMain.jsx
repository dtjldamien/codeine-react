import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ListItem, Typography } from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Service from "../../AxiosService";
import logo from "../../assets/CodeineLogos/Member.svg";
import Navbar from "../../components/Navbar";
import CommentDrawer from "./ArticleComments";
import ViewArticle from "./ViewArticle";
import ArticleIDE from "./ArticleIDE";
import Footer from "./Footer";
import Cookies from "js-cookie";
import Toast from "../../components/Toast.js";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  codeineLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px",
    width: "25%",
    minWidth: "120px",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    padding: "20px 30px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
  tile: {
    height: "100%",
  },
  split: {
    height: "calc(100vh - 65px)",
  },
}));

const ArticleMain = () => {
  const classes = useStyles();
  const history = useHistory();
  //const { state } = useLocation();
  const { id } = useParams();

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

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const memberid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${memberid}`)
        .then((res) => {
          setUser(res.data);
          setLoggedIn(true);
        })
        .catch((err) => {
          setUser();
        });
    }
  };

  const [articleDetails, setArticleDetails] = useState({
    id: "",
    title: "",
    content: "",
    category: [],
    coding_languages: [],
    languages: [],
    engagements: [],
    top_level_comments: [],
  });

  const editorBubble = {
    toolbar: [],
  };

  useEffect(() => {
    checkIfLoggedIn();
    Service.client
      .get(`/articles/${id}`)
      .then((res) => {
        console.log(res.data);
        setArticleDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIDE, setOpenIDE] = useState(false);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/partner" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Teach on Codeine
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/member/register"
          style={{
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link
          to="/member/home"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Dashboard
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            setLoggedIn(false);
            history.push("/");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const [saveState, setSaveState] = useState(true);

  const navLogo = (
    <Fragment>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            marginRight: "35px",
            width: 100,
          }}
        >
          <img src={logo} width="120%" alt="codeine logo" />
        </Link>
        {user && !articleDetails.is_published && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#000000" }}
            >
              Draft in {user.first_name + " " + user.last_name}
            </Typography>
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#0000008a" }}
            >
              {saveState ? "-Saved" : "-Saving"}
            </Typography>
          </div>
        )}
      </div>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />

      {drawerOpen && (
        <CommentDrawer
          user={user}
          openIDE={openIDE}
          setOpenIDE={setOpenIDE}
          articleDetails={articleDetails}
          setArticleDetails={setArticleDetails}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          setSnackbar={setSnackbar}
          setSbOpen={setSbOpen}
        />
      )}

      {openIDE ? (
        <ArticleIDE
          user={user}
          openIDE={openIDE}
          setOpenIDE={setOpenIDE}
          articleDetails={articleDetails}
          setArticleDetails={setArticleDetails}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          setSnackbar={setSnackbar}
          setSbOpen={setSbOpen}
        />
      ) : (
        <>
          <Navbar
            logo={navLogo}
            bgColor="#fff"
            navbarItems={loggedIn && loggedIn ? loggedInNavbar : memberNavbar}
          />
          <ViewArticle
            user={user}
            openIDE={openIDE}
            setOpenIDE={setOpenIDE}
            articleDetails={articleDetails}
            setArticleDetails={setArticleDetails}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            setSnackbar={setSnackbar}
            setSbOpen={setSbOpen}
          />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ArticleMain;
