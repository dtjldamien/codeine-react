import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import Label from "./Label";

const styles = makeStyles((theme) => ({
  root: {
    width: "280px",
    padding: "0 10px",
    marginTop: "30px",
    marginRight: "100px",
    border: "1px solid",
    borderRadius: 0,
  },
  pro: {
    fontFamily: "Roboto Mono",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
    marginTop: "10px",
  },
}));

const CourseCard = (props) => {
  const classes = styles();
  const { course } = props;
  console.log(course);

  return (
    <Card elevation={0} className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography variant="subtitle1" className={classes.pro}>
            PRO
          </Typography>

          <Typography
            style={{
              fontFamily: "Roboto Mono",
              fontWeight: 600,
            }}
            variant="h6"
          >
            {course && course.title}
          </Typography>
          <Typography
            variant="body1"
            style={{
              paddingBottom: "50px",
              fontFamily: "Roboto Mono",
              fontWeight: 600,
            }}
          >
            {course &&
              course.partner.first_name + " " + course.partner.last_name}
          </Typography>
          <Typography
            variant="body1"
            style={{ fontFamily: "Roboto Mono", fontWeight: 600 }}
          >
            duration: 16h
          </Typography>
          <Typography
            variant="body1"
            style={{ fontFamily: "Roboto Mono", fontWeight: 600 }}
          >
            exp points: {course && course.exp_points}p
          </Typography>
          <div style={{ display: "flex", margin: "10px 0" }}>
            {course &&
              course.categories.map((category) => <Label label={category} />)}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseCard;
