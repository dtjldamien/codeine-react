import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import {
  Add,
  Assignment,
  AttachFile,
  Delete,
  DragIndicator,
  Edit,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import validator from "validator";
import Toast from "../../../components/Toast";

import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 8,
    border: "1px solid lightgrey",
    borderRadius: 2,
    width: 220,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  columnHeader: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: "5px",
  },
  title: {
    cursor: "pointer",
    display: "inline-block",
    width: 170,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  taskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "100px",
  },
  handle: {
    width: 20,
    marginRight: "10px",
    paddingTop: "5px",
  },
  dialogButtons: {
    width: 100,
  },
  courseMaterialButton: {
    marginBottom: "5px",
    textTransform: "capitalize",
    width: 150,
    color: theme.palette.primary.main,
    backgroundColor: "#fff",
  },
}));

const Column = ({ column, tasks, index, courseId, getCourse }) => {
  const classes = useStyles();
  // console.log(courseId);

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

  const [chapterDetailsDialog, setChapterDetailsDialog] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editChapter, setEditChapter] = useState();

  const [deleteChapterDialog, setDeleteChapterDialog] = useState(false);
  const [deleteChapterId, setDeleteChapterId] = useState(false);

  const [courseMaterialDialog, setCourseMaterialDialog] = useState(false);
  const [materialType, setMaterialType] = useState();
  const [file, setFile] = useState();
  const [video, setVideo] = useState({
    title: "",
    description: "",
    video_url: "",
  });
  const [quiz, setQuiz] = useState();
  const [chapterIdForCouseMaterial, setChapterIdForCourseMaterial] = useState();

  const handleUpdateChapterDetails = (e) => {
    e.preventDefault();
    Service.client
      .put(`/courses/${courseId}/chapters/${column.id}`, editChapter)
      .then((res) => {
        console.log(res);
        setChapterDetailsDialog(false);
        setEditMode(false);
        setEditChapter();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteChapter = () => {
    setDeleteChapterDialog(false);
    Service.client
      .delete(`/courses/${courseId}/chapters/${deleteChapterId}`)
      .then((res) => {
        console.log(res);
        setDeleteChapterId();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const handleCreateCourseMaterial = () => {
    if (materialType === "video") {
      // check for empty fields
      if (
        video.title === "" ||
        video.description === "" ||
        video.video_url === ""
      ) {
        setSbOpen(true);
        setSnackbar({
          message: "Please fill up all fields!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      // check if video URL is a valid URL
      if (
        !validator.isURL(video.video_url, {
          protocols: ["http", "https"],
          require_protocol: true,
          allow_underscores: true,
        })
      ) {
        setSbOpen(true);
        setSnackbar({
          message: "Please enter a valid URL!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      Service.client
        .post(`/chapters/${chapterIdForCouseMaterial}/videos`, video)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
          setVideo({
            title: "",
            description: "",
            video_url: "",
          });
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };

  // console.log(column);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Draggable draggableId={column.id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              className={classes.container}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <div className={classes.columnHeader}>
                <div {...provided.dragHandleProps} className={classes.handle}>
                  <DragIndicator />
                </div>
                <LinkMui
                  className={classes.title}
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    setEditChapter({
                      title: column.title,
                      overview: column.overview,
                    });
                    setChapterDetailsDialog(true);
                  }}
                >
                  {column.title}
                </LinkMui>
                {/* <IconButton size="small">
                  <Add />
                </IconButton> */}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AttachFile />}
                  className={classes.courseMaterialButton}
                  onClick={() => {
                    setMaterialType("file");
                    setCourseMaterialDialog(true);
                    setChapterIdForCourseMaterial(column.id);
                  }}
                >
                  Add File
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Movie />}
                  className={classes.courseMaterialButton}
                  onClick={() => {
                    setMaterialType("video");
                    setCourseMaterialDialog(true);
                    setChapterIdForCourseMaterial(column.id);
                  }}
                >
                  Add Video
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Assignment />}
                  className={classes.courseMaterialButton}
                  onClick={() => {
                    setMaterialType("quiz");
                    setCourseMaterialDialog(true);
                    setChapterIdForCourseMaterial(column.id);
                  }}
                >
                  Add Quiz
                </Button>
              </div>

              <Droppable droppableId={column.id} type="task">
                {(provided) => {
                  return (
                    <div
                      className={classes.taskList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        backgroundColor: snapshot.isDragging
                          ? "#e0e0e0"
                          : "#fff",
                      }}
                    >
                      {tasks &&
                        tasks.map((task, index) => (
                          <Task key={task.id} task={task} index={index} />
                        ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        }}
      </Draggable>
      <Dialog
        open={chapterDetailsDialog}
        onClose={() => {
          setChapterDetailsDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <form onSubmit={handleUpdateChapterDetails}>
          <DialogTitle>
            {column.title}
            <div style={{ float: "right" }}>
              <IconButton size="small" onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setDeleteChapterId(column.id);
                  setDeleteChapterDialog(true);
                }}
              >
                <Delete />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent>
            <label htmlFor="title">
              <Typography variant="body2">Chapter Title</Typography>
            </label>
            <TextField
              id="title"
              variant="outlined"
              fullWidth
              margin="dense"
              value={editChapter && editChapter.title}
              onChange={(e) => {
                setEditChapter({
                  ...editChapter,
                  title: e.target.value,
                });
              }}
              required
              disabled={!editMode}
            />
            <label htmlFor="overview">
              <Typography variant="body2">Chapter Overview</Typography>
            </label>
            <TextField
              id="overview"
              variant="outlined"
              fullWidth
              margin="dense"
              value={editChapter && editChapter.overview}
              onChange={(e) => {
                setEditChapter({
                  ...editChapter,
                  overview: e.target.value,
                });
              }}
              required
              disabled={!editMode}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setChapterDetailsDialog(false);
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.dialogButtons}
              type="submit"
              disabled={!editMode}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteChapterDialog}
        onClose={() => {
          setDeleteChapterId();
          setDeleteChapterDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete this chapter?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteChapterId();
              setDeleteChapterDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleDeleteChapter();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={courseMaterialDialog}
        onClose={() => {
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <form onSubmit={handleCreateCourseMaterial}>
          <DialogTitle>Add Course Material</DialogTitle>
          <DialogContent>
            {(() => {
              if (courseMaterialDialog) {
                if (materialType === "file") {
                } else if (materialType === "video") {
                  return (
                    <Fragment>
                      <label htmlFor="title">
                        <Typography variant="body2">Title of Video</Typography>
                      </label>
                      <TextField
                        id="title"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={video && video.title}
                        onChange={(e) => {
                          setVideo({
                            ...video,
                            title: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Title"
                        style={{ marginBottom: "15px" }}
                      />
                      <label htmlFor="description">
                        <Typography variant="body2">
                          Description of Video
                        </Typography>
                      </label>
                      <TextField
                        id="description"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={video && video.description}
                        onChange={(e) => {
                          setVideo({
                            ...video,
                            description: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Description"
                        style={{ marginBottom: "15px" }}
                      />
                      <label htmlFor="url">
                        <Typography variant="body2">Video URL</Typography>
                      </label>
                      <TextField
                        id="url"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={video && video.video_url}
                        onChange={(e) => {
                          setVideo({
                            ...video,
                            video_url: e.target.value,
                          });
                        }}
                        required
                        placeholder="https://www.google.com"
                        style={{ marginBottom: "15px" }}
                      />
                    </Fragment>
                  );
                } else if (materialType === "quiz") {
                }
              }
            })()}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setCourseMaterialDialog(false);
                setMaterialType();
                setChapterIdForCourseMaterial();
                setVideo({
                  title: "",
                  description: "",
                  video_url: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.dialogButtons}
              onClick={() => {
                handleCreateCourseMaterial();
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

export default Column;
