import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: "#437FC7",
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
    fontSize: "16px",
    flexGrow: 1,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    fontSize: "16px",
    paddingTop: "20px",
    flexGrow: 1,
  },
  footerLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    marginBottom: "10px",
  },
  logo: {
    backgroundColor: "#437FC7",
    justify: "space-between",
  },
  copyright: {
    color: "#FFFFFF",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.leftCol}>
          <Link to="/" className={classes.footerLink}>
            Members
          </Link>
          <Link to="/" className={classes.footerLink}>
            Content Providers
          </Link>
          <Link to="/" className={classes.footerLink}>
            Industry Partners
          </Link>
        </div>
        <div className={classes.rightCol}>
          <Link to="/" className={classes.footerLink}>
            Articles
          </Link>
          <Link to="/" className={classes.footerLink}>
            Help & Support
          </Link>
        </div>
      </div>
      <div className={classes.logo}>
        <Typography variant="body1" className={classes.copyright}>
          &copy; Codeine 2021
        </Typography>
      </div>
    </Fragment>
  );
};

export default Footer;
