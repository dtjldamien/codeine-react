import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import logo from "../../../assets/codeineLogos/Partner.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    paddingTop: "50px",
    paddingBottom: "50px",

    paddingLeft: theme.spacing(15),
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    flexGrow: 1,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    flexGrow: 1,
  },
  footerLink: {
    color: "#4B4B4B",
    textDecoration: "none",
    marginBottom: "10px",
  },
  logo: {
    backgroundColor: "#fff",
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    paddingBottom: "30px",
    display: "flex-end",
  },
  copyright: {
    float: "right",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.leftCol}>
          <Link to="/" className={classes.footerLink}>
            Learn On Codeine
          </Link>
          <Link to="/partner" className={classes.footerLink}>
            Teach On Codeine
          </Link>
          {/* <Link to="/industry" className={classes.footerLink}>
            Partners for Enterprise
          </Link> */}
        </div>
        <div className={classes.rightCol}>
          <Link to="/viewarticles" className={classes.footerLink}>
            Articles
          </Link>
          <Link to="/" className={classes.footerLink}>
            Help & Support
          </Link>
        </div>
      </div>
      <div className={classes.logo}>
        <Link
          to="/partner"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            width: 100,
          }}
        >
          <img src={logo} width="100px" alt="partner-logo" />
        </Link>
        <Typography variant="body1" className={classes.copyright}>
          &copy; Codeine 2021
        </Typography>
      </div>
    </Fragment>
  );
};

export default Footer;
