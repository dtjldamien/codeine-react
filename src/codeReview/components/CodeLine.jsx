import React, { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Chip, IconButton } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import hljs from "highlight.js";

import Service from "../../AxiosService";
import CommentTextArea from "./CommentTextArea";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
  gutter: {
    padding: theme.spacing(0.8, 1),
    background: "rgba(67, 127, 199, 0.2)",
    color: theme.palette.secondary.main,
    minWidth: "50px",
    textAlign: "right",
  },
  codeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    background: "rgba(164, 201, 245, 0.1)",
    display: "flex",
    overflow: "hidden",
    overflowX: "overlay",
    "&:hover": {
      background: "rgba(164, 201, 245, 0.3)",
      cursor: "pointer",
      overflow: "hidden",
      overflowX: "overlay",
    },
  },
  selectedCodeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    background: "rgba(255, 123, 110, 0.2)",
    display: "flex",
    overflow: "hidden",
    overflowX: "overlay",
    "&:hover": {
      background: "rgba(255, 123, 110, 0.3)",
      cursor: "pointer",
      overflow: "hidden",
      overflowX: "overlay",
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
  discussions: {
    minWidth: "130px",
    width: "130px",
  },
  chip: {
    background: "#a3de83",
    margin: theme.spacing(0, 0.5),
  },
}));

const CodeLine = ({
  index,
  code,
  language,
  selectedLine,
  setSelectedLine,
  loggedIn,
  getCodeReviewComments,
  discussions,
}) => {
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
        // console.log(res);
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
        <div className={classes.discussions}>
          {discussions > 0 && <Chip classes={{ root: classes.chip }} size="small" label={`${discussions} discussion(s)`} />}
        </div>
      </div>
      {addComment && (
        <CommentTextArea
          comment={comment}
          setComment={setComment}
          closeCommentTextArea={() => setAddComment(false)}
          onSubmit={() => createComment()}
        />
      )}
    </Fragment>
  );
};

export default CodeLine;
