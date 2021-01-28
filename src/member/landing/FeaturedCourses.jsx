import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import background from "../../assets/background.jpg";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "30px",
    [theme.breakpoints.down("xs")]: {
      paddingTop: "160px",
      paddingLeft: "0px",
    },
  },
  heading: {
    color: "#437FC7",
    fontSize: "42px",
    lineHeight: "50px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "32px",
    },
  },
  cardroot: {
    marginTop: "6vh",
    width: "80%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  cardmedia: {
    height: 0,
    paddingTop: "56.25%",
  },
}));

const FeaturedCourses = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography className={classes.heading}>FEATURED</Typography>
          <Typography className={classes.heading}>COURSES</Typography>
          <Grid container>
            <Grid item xs={4}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={background}
                  title="Course thumbnail"
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    Title of course
                  </Typography>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                      display: "inline-block",
                      float: "right",
                    }}
                  >
                    $55.00
                  </Typography>
                  <Typography variant="h5">Content Provider</Typography>
                  <Grid
                    container
                    style={{
                      marginTop: "1vh",
                    }}
                  >
                    <Grid item xs={12} lg={8}>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Rating
                          name="read-only"
                          value="3.5"
                          precision={0.1}
                          readOnly
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            marginTop: "2px",
                            color: "#F8B83C",
                            marginLeft: "1vw",
                          }}
                        >
                          3.5
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography
                        variant="body2"
                        style={{
                          marginTop: "2px",
                          color: "#9B9B9B",
                          float: "right",
                        }}
                      >
                        125 enrolled
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={background}
                  title="Course thumbnail"
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    Title of course
                  </Typography>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                      display: "inline-block",
                      float: "right",
                    }}
                  >
                    $55.00
                  </Typography>
                  <Typography variant="h5">Content Provider</Typography>
                  <Grid
                    container
                    style={{
                      marginTop: "1vh",
                    }}
                  >
                    <Grid item xs={12} lg={8}>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Rating
                          name="read-only"
                          value="3.5"
                          precision={0.1}
                          readOnly
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            marginTop: "2px",
                            color: "#F8B83C",
                            marginLeft: "1vw",
                          }}
                        >
                          3.5
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography
                        variant="body2"
                        style={{
                          marginTop: "2px",
                          color: "#9B9B9B",
                          float: "right",
                        }}
                      >
                        125 enrolled
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={background}
                  title="Course thumbnail"
                />
                <CardContent height="150" width="150">
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                      display: "inline-block",
                    }}
                  >
                    Title of course
                  </Typography>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                      display: "inline-block",
                      float: "right",
                    }}
                  >
                    $55.00
                  </Typography>
                  <Typography variant="h5">Content Provider</Typography>
                  <Grid
                    container
                    style={{
                      marginTop: "1vh",
                    }}
                  >
                    <Grid item xs={12} lg={8}>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Rating
                          name="read-only"
                          value="3.5"
                          precision={0.1}
                          readOnly
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            marginTop: "2px",
                            color: "#F8B83C",
                            marginLeft: "1vw",
                          }}
                        >
                          3.5
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography
                        variant="body2"
                        style={{
                          marginTop: "2px",
                          color: "#9B9B9B",
                          float: "right",
                        }}
                      >
                        125 enrolled
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default FeaturedCourses;