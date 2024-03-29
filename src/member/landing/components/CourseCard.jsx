import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Label from "./Label";

const styles = makeStyles((theme) => ({
  root: {
    width: "300px",
    padding: "10px 10px",
    marginTop: "30px",
    marginRight: "50px",
    border: "1px solid",
    borderRadius: 0,
  },
  pro: {
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
    color: "#FFFFFF",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
  free: {
    backgroundColor: "rgba(84,84,84,1)",
    color: "#FFFFFF",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "38px",
  },
}));

const CourseCard = (props) => {
  const classes = styles();
  const { course } = props;

  return (
    <Card elevation={0} className={classes.root}>
      <Link
        style={{ height: "100%" }}
        to={`/courses/${course && course.id}`}
        component={CardActionArea}
      >
        <CardContent
          style={{
            height: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {course && course.pro === true ? (
              <div style={{ height: "25px" }}>
                <Typography variant="subtitle1" className={classes.pro}>
                  PRO
                </Typography>
              </div>
            ) : (
              <div style={{ height: "25px" }}>
                <Typography variant="subtitle1" className={classes.free}>
                  FREE
                </Typography>
              </div>
            )}

            <Typography
              style={{
                fontWeight: 600,
              }}
              variant="h6"
            >
              {course && course.title}
            </Typography>
            <Typography
              variant="body1"
              style={{
                paddingBottom: "30px",
              }}
            >
              {course &&
                course.partner.first_name + " " + course.partner.last_name}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              duration: {course && course.duration}h
            </Typography>
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              exp points: {course && course.exp_points}p
            </Typography>
            <div style={{ display: "flex", margin: "10px 0" }}>
              {course &&
                course.categories.map((category) => <Label label={category} />)}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourseCard;
