import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Typography } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import Service from "../AxiosService";
import logo from "../assets/CodeineLogos/Partner.svg";
import logo1 from "../assets/CodeineLogos/Member.svg";

const styles = makeStyles((theme) => ({
  root: {
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
}));

const PaymentSuccess = () => {
  const classes = styles();
  // const { id } = useParams();
  const location = useLocation();
  const history = useHistory();

  const [user, setUser] = useState();

  const handleRedirect = () => {
    if (user === "partner") {
      history.push(`/partner/home/content`);
    } else {
      // return to member consult
    }
  };

  useEffect(() => {
    if (new URLSearchParams(location.search).get("pId") !== null) {
      setUser("partner");
    } else {
      setUser("member");
    }

    // in future create payment transaction for the user

    if (new URLSearchParams(location.search).get("courseId") !== null) {
      Service.client
        .patch(
          `/courses/${new URLSearchParams(location.search).get(
            "courseId"
          )}/publish`
        )
        .then((res) => {
          console.log(res);
          localStorage.removeItem("courseId");
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.codeineLogo}>
          <img
            src={user && user === "partner" ? logo : logo1}
            alt="logo"
            width="90%"
          />
        </div>
        <Typography
          variant="h5"
          style={{ paddingTop: "20px", fontWeight: 600, textAlign: "center" }}
        >
          We have received your payment!
        </Typography>
        <Typography
          variant="body1"
          style={{ paddingTop: "10px", textAlign: "center" }}
        >
          Click on the button below to continue.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "25px" }}
          onClick={() => handleRedirect()}
        >
          Bring Me Back
        </Button>
      </Paper>
    </div>
  );
};

export default PaymentSuccess;