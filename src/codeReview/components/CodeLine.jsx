import React, { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardActions, CardContent, IconButton } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import hljs from "highlight.js";

import "react-quill/dist/quill.snow.css";
import "./quill.css";
import ReactQuill from "react-quill";

import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
  gutter: {
    padding: theme.spacing(0.8, 2),
    background: "rgba(67, 127, 199, 0.2)",
    color: theme.palette.secondary.main,
  },
  codeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    background: "rgba(164, 201, 245, 0.1)",
    display: "flex",
    "&:hover": {
      background: "rgba(164, 201, 245, 0.3)",
      cursor: "pointer",
    },
  },
  selectedCodeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    background: "rgba(255, 123, 110, 0.2)",
    display: "flex",
    "&:hover": {
      background: "rgba(255, 123, 110, 0.3)",
      cursor: "pointer",
    },
  },
  iconButton: {
    padding: 0,
    margin: "-4px 8px",
    fontSize: "22px",
    color: theme.palette.primary.main,
    transition: "all .15s ease-in-out",
    "&:hover": {
      color: theme.palette.secondary.main,
      background: "transparent",
      transform: "scale(1.2)",
    },
  },
  cardRoot: {
    margin: theme.spacing(1, 0),
  },
  quill: {
    minHeight: "100px",
  },
  cardActions: {
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    justifyContent: "flex-end",
  },
  button: {
    textTransform: "none",
  },
}));

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "code-block"],
    ["link", "image"],
  ],
};

const formats = ["bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link"];

const CodeLine = ({ index, code, language, selectedLine, setSelectedLine, loggedIn, getCodeReviewComments }) => {
  const classes = useStyles();
  const { id } = useParams();

  const [hover, setHover] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [comment, setComment] = useState("");

  const createComment = () => {
    Service.client
      .post(`/code-reviews/${id}/comments`, {
        comment: comment,
        code_line_index: index,
      })
      .then((res) => {
        console.log(res);
        setComment("");
        setAddComment(false);
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <div
        className={classes.flex}
        onClick={() => setSelectedLine(index)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={classes.gutter}>{index}</div>
        <div className={selectedLine !== index ? classes.codeBody : classes.selectedCodeBody}>
          <pre style={{ margin: 0 }}>
            <div dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code, [language]).value }} />
          </pre>
          {hover && loggedIn && (
            <IconButton
              disableRipple
              classes={{ root: classes.iconButton }}
              size="small"
              onClick={() => setAddComment(!addComment)}
            >
              <AddCircle fontSize="inherit" />
            </IconButton>
          )}
        </div>
      </div>
      {addComment && (
        <Card className={classes.cardRoot}>
          <CardContent>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={comment}
              onChange={(content) => setComment(content)}
            />
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button className={classes.button} variant="outlined" onClick={() => setAddComment(false)}>
              Cancel
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={comment === ""}
              onClick={() => createComment()}
            >
              Add comment
            </Button>
          </CardActions>
        </Card>
      )}
    </Fragment>
  );
};

export default CodeLine;
