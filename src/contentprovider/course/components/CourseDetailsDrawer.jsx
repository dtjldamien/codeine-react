import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Folder } from "@material-ui/icons";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { ToggleButton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 450,
  },
  insideDrawer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(7),
    minHeight: "100vh",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  languageButtons: {
    width: 80,
    marginRight: "15px",
    height: 30,
  },
  categoryButtons: {
    marginBottom: "10px",
    height: 30,
  },
}));

const CourseDetailsDrawer = ({
  drawerOpen,
  setDrawerOpen,
  coursePicAvatar,
  setCoursePicAvatar,
}) => {
  const classes = useStyles();

  const [drawerPageNum, setDrawerPageNum] = useState(1);

  const [coursePicDialog, setCoursePicDialog] = useState(false);
  const [coursePic, setCoursePic] = useState();

  const [languages, setLanguages] = useState({
    ENG: false,
    MAN: false,
    FRE: false,
  });

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(false);
    setDrawerPageNum(1);
  };

  const handleUpdateCourseDetails = () => {
    setDrawerOpen(false);
    setDrawerPageNum(1);
  };

  const drawerPage1 = (
    <Fragment>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton onClick={() => setCoursePicDialog(true)}>
          {coursePicAvatar ? (
            <Avatar className={classes.avatar} src={coursePicAvatar[0].data} />
          ) : (
            <Avatar className={classes.avatar}>
              <Folder fontSize="large" />
            </Avatar>
          )}
        </IconButton>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="title">
          <Typography variant="body2">Course Title</Typography>
        </label>
        <TextField
          id="title"
          variant="outlined"
          placeholder="Enter course title"
          margin="dense"
          fullWidth
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="description">
          <Typography variant="body2">Course Description</Typography>
        </label>
        <TextField
          id="description"
          variant="outlined"
          placeholder="Enter course description"
          margin="dense"
          fullWidth
          multiline
          rows={2}
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="requirements">
          <Typography variant="body2">Course Requirements</Typography>
        </label>
        <TextField
          id="requirements"
          variant="outlined"
          placeholder="eg. Node.JS, Java EE"
          margin="dense"
          fullWidth
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="objectives">
          <Typography variant="body2">Course Learning Objectives</Typography>
        </label>
        <TextField
          id="objectives"
          variant="outlined"
          placeholder="Enter learning objectives"
          margin="dense"
          fullWidth
          multiline
          rows={2}
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={() => setDrawerPageNum(2)}
        >
          Next
        </Button>
      </div>
    </Fragment>
  );

  const drawerPage2 = (
    <Fragment>
      <div style={{ marginBottom: "30px" }}>
        <Typography variant="body2" style={{ paddingBottom: "10px" }}>
          Course Language
        </Typography>
        <div>
          <ToggleButton
            size="small"
            selected={languages && languages.ENG}
            onChange={() => {
              setLanguages({ ...languages, ENG: !languages.ENG });
            }}
            className={classes.languageButtons}
          >
            English
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={languages && languages.MAN}
            onChange={() => {
              setLanguages({ ...languages, MAN: !languages.MAN });
            }}
            className={classes.languageButtons}
          >
            中文
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={languages && languages.FRE}
            onChange={() => {
              setLanguages({ ...languages, FRE: !languages.FRE });
            }}
            className={classes.languageButtons}
          >
            français
          </ToggleButton>
        </div>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Typography variant="body2" style={{ paddingBottom: "10px" }}>
          Category
        </Typography>
        <div>
          <ToggleButton
            size="small"
            selected={categories && categories.SEC}
            onChange={() => {
              setCategories({ ...categories, SEC: !categories.SEC });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Security
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={categories && categories.DB}
            onChange={() => {
              setCategories({ ...categories, DB: !categories.DB });
            }}
            className={`${classes.categoryButtons}`}
          >
            Database Administration
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={categories && categories.FE}
            onChange={() => {
              setCategories({ ...categories, FE: !categories.FE });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Frontend
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={categories && categories.BE}
            onChange={() => {
              setCategories({ ...categories, BE: !categories.BE });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Backend
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={categories && categories.UI}
            onChange={() => {
              setCategories({ ...categories, UI: !categories.UI });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            UI/UX
          </ToggleButton>
          <ToggleButton
            size="small"
            selected={categories && categories.ML}
            onChange={() => {
              setCategories({ ...categories, ML: !categories.ML });
            }}
            className={`${classes.categoryButtons}`}
          >
            Machine Learning
          </ToggleButton>
        </div>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="preview">
          <Typography variant="body2">
            Introduction Preview Video URL
          </Typography>
        </label>
        <TextField
          id="preview"
          variant="outlined"
          margin="dense"
          fullWidth
          placeholder="eg. URL of video hosted on youtube"
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="points">
          <Typography variant="body2">Experience Points</Typography>
        </label>
        <TextField
          id="points"
          variant="outlined"
          margin="dense"
          fullWidth
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={() => setDrawerPageNum(1)}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdateCourseDetails()}
        >
          Update
        </Button>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      <div>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{ paper: classes.drawer }}
        >
          <div className={classes.insideDrawer}>
            {drawerPageNum && drawerPageNum === 1 ? drawerPage1 : drawerPage2}
          </div>
        </Drawer>
      </div>

      <Dialog
        disableEscapeKeyDown
        open={coursePicDialog}
        onClose={() => setCoursePicDialog(false)}
        PaperProps={{
          style: {
            minWidth: "400px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogContent>
          <DropzoneAreaBase
            dropzoneText="Drag and drop an image or click here&nbsp;"
            acceptedFiles={["image/*"]}
            filesLimit={1}
            maxFileSize={5000000}
            fileObjects={coursePic}
            onAdd={(newPhoto) => {
              // console.log("onAdd", newPhoto);
              setCoursePic(newPhoto);
              // setValidatePhoto(false);
            }}
            onDelete={(deletePhotoObj) => {
              console.log("onDelete", deletePhotoObj);
              setCoursePic();
            }}
            previewGridProps={{
              item: {
                xs: "auto",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setCoursePic(coursePicAvatar);
              setCoursePicDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCoursePicAvatar(coursePic && coursePic);
              setCoursePicDialog(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CourseDetailsDrawer;
