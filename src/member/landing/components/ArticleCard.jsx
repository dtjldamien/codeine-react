import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from "@material-ui/core";
import Label from "./Label";
import { useHistory } from "react-router";

const styles = makeStyles((theme) => ({
  root: {
    marginTop: "20px",
    border: "1px solid",
    borderRadius: 0,
    width: "100%",
  },
  heading: {
    fontFamily: "Roboto Mono",
    fontSize: "62px",
    color: "#CECECE",
    marginLeft: "0.8vw",
    lineHeight: "80px",
  },
}));

const ArticleCard = (props) => {
  const classes = styles();
  const { article, index } = props;
  const history = useHistory();
  // console.log(article);

  let numbering = index + 1;
  if (numbering < 10) {
    numbering = "0" + numbering;
  }

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

  return (
    <Card elevation={0} className={classes.root}>
      <CardActionArea onClick={() => history.push(`/article/${article.id}`)}>
        <CardContent>
          <Grid container>
            <Grid item xs={1}>
              <Typography className={classes.heading}>{numbering}</Typography>
            </Grid>
            <Grid item xs={11}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">
                  {article.user &&
                    article.user.first_name + " " + article.user.last_name}
                </Typography>
                <Typography variant="body2">
                  last updated on {article && formatDate(article.date_edited)}
                </Typography>
              </div>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "600",
                }}
              >
                {article && article.title}
              </Typography>
              <div style={{ display: "flex", marginTop: "10px" }}>
                {article &&
                  article.categories.map((category) => (
                    <Label label={category} />
                  ))}
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
