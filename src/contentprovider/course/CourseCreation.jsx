import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Edit } from "@material-ui/icons";
import CourseDetailsDrawer from "./components/CourseDetailsDrawer";
import PageTitle from "../../components/PageTitle";

import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import CourseKanbanBoard from "./components/CourseKanbanBoard";
import { useParams } from "react-router-dom";
import QuizKanbanBoard from "./components/QuizKanbanBoard";

const useStyles = makeStyles((theme) => ({
  buttonSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogButtons: {
    width: 100,
  },
}));

const CourseCreation = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [pageNum, setPageNum] = useState(2);

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

  const [chapterDialog, setChapterDialog] = useState(false);
  const [numOfChapters, setNumOfChapters] = useState(0);
  const [chapterDetails, setChapterDetails] = useState({
    title: "",
    overview: "",
  });
  const [allChapters, setAllChapters] = useState({
    columns: {},
    tasks: {},
    columnOrder: [],
    subtasks: {},
  });

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerPageNum, setDrawerPageNum] = useState(1);

  const [coursePicAvatar, setCoursePicAvatar] = useState();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    learning_objectives: [],
    requirements: [],
    introduction_video_url: "",
    exp_points: 0,
  });

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

  const [codeLanguage, setCodeLanguage] = useState({
    PY: false,
    JAVA: false,
    JS: false,
    CPP: false,
    CS: false,
    HTML: false,
    CSS: false,
    RUBY: false,
  });

  const [courseId, setCourseId] = useState();

  const [finalQuizDialog, setFinalQuizDialog] = useState(false);
  const [finalQuiz, setFinalQuiz] = useState({
    instructions: "",
    passing_marks: 0,
  });
  const [finalQuizQuestions, setFinalQuizQuestions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  // console.log(courseDetails);

  const handleSaveCourseDetails = () => {
    console.log(coursePicAvatar);
    if (!coursePicAvatar) {
      setSbOpen(true);
      setSnackbar({
        message: "Please give a picture for your course!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (
      courseDetails.title === "" ||
      courseDetails.description === "" ||
      courseDetails.learning_objectives.length === 0 ||
      courseDetails.requirements.length === 0
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter required fields!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let neverChooseOne = true;
    for (const property in languages) {
      if (languages[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 course language",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    neverChooseOne = true;
    for (const property in categories) {
      if (categories[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 category",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    neverChooseOne = true;
    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message:
          "Please select at least 1 coding language/framework for your course",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let data = {
      ...courseDetails,
      coding_languages: [],
      languages: [],
      categories: [],
      price: 20,
      thumbnail: coursePicAvatar[0].file,
    };

    for (const property in languages) {
      if (languages[property]) {
        data.languages.push(property);
      }
    }

    for (const property in categories) {
      if (categories[property]) {
        data.categories.push(property);
      }
    }

    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        data.coding_languages.push(property);
      }
    }
    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append(
      "learning_objectives",
      JSON.stringify(data.learning_objectives)
    );
    formData.append("requirements", JSON.stringify(data.requirements));
    formData.append("introduction_video_url", data.requirements);

    if (!courseId && data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    formData.append("coding_languages", JSON.stringify(data.coding_languages));
    formData.append("languages", JSON.stringify(data.languages));
    formData.append("categories", JSON.stringify(data.categories));
    formData.append("price", data.price);
    formData.append("exp_points", data.exp_points);

    if (courseId) {
      Service.client
        .put(`/courses/${courseId}`, formData)
        .then((res) => {
          console.log(res);
          setDrawerOpen(false);
          setDrawerPageNum(1);
          setCoursePicAvatar();
          getCourse();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/courses`, formData)
        .then((res) => {
          console.log(res);
          setDrawerOpen(false);
          setDrawerPageNum(1);
          localStorage.setItem("courseId", res.data.id);
          setCoursePicAvatar();
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };

  const getCourse = () => {
    let chosenId = "";
    if (id) {
      setCourseId(id);
      chosenId = id;
    } else {
      const idFromLocal = localStorage.getItem("courseId");
      setCourseId(idFromLocal);
      chosenId = idFromLocal;
    }

    if (chosenId) {
      Service.client
        .get(`/courses/${chosenId}`)
        .then((res) => {
          console.log(res);
          setCourseDetails({
            title: res.data.title,
            description: res.data.description,
            learning_objectives: res.data.description,
            requirements: res.data.requirements,
            introduction_video_url: res.data.introduction_video_url,
            exp_points: res.data.exp_points,
          });
          const obj = {
            data: res.data.thumbnail,
          };
          setCoursePicAvatar([obj]);

          setNumOfChapters(res.data.chapters.length);
          // setAllChapters(res.data.chapters);

          // setting the right data for the kanban board
          let columnOrder = [];
          res.data.chapters.forEach((chapter) => columnOrder.push(chapter.id));

          let columns = {};
          let tasksObj = {};
          let subtasksObj = {};
          res.data.chapters.forEach((chapter) => {
            columns = {
              ...columns,
              [chapter.id]: chapter,
            };
            let taskIdsArr = [];
            let subtaskIdsArr = [];

            // console.log(chapter);
            chapter.course_materials.forEach((courseMaterial) => {
              taskIdsArr.push(courseMaterial.id);
              tasksObj = {
                ...tasksObj,
                [courseMaterial.id]: courseMaterial,
              };

              courseMaterial.quiz &&
                courseMaterial.quiz.questions.forEach((question) => {
                  subtaskIdsArr.push(question.id);
                  subtasksObj = {
                    ...subtasksObj,
                    [question.id]: question,
                  };
                });

              tasksObj = {
                ...tasksObj,
                [courseMaterial.id]: {
                  ...tasksObj[courseMaterial.id],
                  subtaskIds: subtaskIdsArr,
                },
              };
            });

            // console.log(tasksObj);

            columns = {
              ...columns,
              [chapter.id]: {
                ...columns[chapter.id],
                taskIds: taskIdsArr,
              },
            };
          });
          // console.log(columns);
          setAllChapters({
            ...allChapters,
            columnOrder: columnOrder,
            columns: columns,
            tasks: tasksObj,
            subtasks: subtasksObj,
          });

          let newLanguages = { ...languages };
          for (let i = 0; i < res.data.languages.length; i++) {
            newLanguages = {
              ...newLanguages,
              [res.data.languages[i]]: true,
            };
          }
          setLanguages(newLanguages);

          let newCategories = { ...categories };
          for (let i = 0; i < res.data.categories.length; i++) {
            newCategories = {
              ...newCategories,
              [res.data.categories[i]]: true,
            };
          }
          setCategories(newCategories);

          let newCodeLanguages = { ...codeLanguage };
          for (let i = 0; i < res.data.coding_languages.length; i++) {
            newCodeLanguages = {
              ...newCodeLanguages,
              [res.data.coding_languages[i]]: true,
            };
          }
          setCodeLanguage(newCodeLanguages);

          // setting final assessment details
          if (res.data.assessment) {
            setFinalQuiz({
              id: res.data.assessment.id,
              instructions: res.data.assessment.instructions,
              passing_marks: res.data.assessment.passing_marks,
            });

            let data = {
              tasks: {},
              taskIds: [],
            };
            for (let i = 0; i < res.data.assessment.questions.length; i++) {
              data = {
                ...data,
                tasks: {
                  ...data.tasks,
                  [res.data.assessment.questions[i].id]:
                    res.data.assessment.questions[i],
                },
              };
            }

            let arr = [];
            if (res.data.assessment.questions.length > 0) {
              res.data.assessment.questions.forEach((question) =>
                arr.push(question.id)
              );
              data = {
                ...data,
                taskIds: arr,
              };
            }
            // console.log(data);
            // setFinalQuizQuestions(res.data.assessment.questions);
            setFinalQuizQuestions(data);
          } else {
            setFinalQuizDialog(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSaveChapter = (e) => {
    e.preventDefault();
    const data = {
      ...chapterDetails,
      order: numOfChapters,
    };

    Service.client
      .post(`/courses/${courseId}/chapters`, data)
      .then((res) => {
        console.log(res);
        setChapterDialog(false);
        getCourse();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setToNextPage = () => {
    // handleSaveCourseDetails();

    for (const column in allChapters.columns) {
      if (allChapters.columns[column].course_materials.length === 0) {
        setSbOpen(true);
        setSnackbar({
          message: "Every chapter should have a course material",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      for (const material in allChapters.columns[column].course_materials) {
        if (
          allChapters.columns[column].course_materials[material]
            .material_type === "QUIZ" &&
          allChapters.columns[column].course_materials[material].quiz.questions
            .length === 0
        ) {
          setSbOpen(true);
          setSnackbar({
            message: "Every quiz should have at least 1 question",
            severity: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
          return;
        }
      }
    }

    setPageNum(pageNum + 1);
  };

  const handleSaveFinalQuizDetails = () => {
    if (finalQuiz.instructions === "" || finalQuiz.marks === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Please fill up all fields",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (editMode) {
      const data = {
        instructions: finalQuiz.instructions,
        passing_marks: finalQuiz.passing_marks,
      };

      Service.client
        .put(`/courses/${courseId}/assessments/${finalQuiz.id}`, data)
        .then((res) => {
          console.log(res);
          setFinalQuizDialog(false);
          setFinalQuiz({
            instructions: "",
            passing_marks: 0,
          });
          getCourse();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/courses/${courseId}/assessments`, finalQuiz)
        .then((res) => {
          console.log(res);
          setFinalQuizDialog(false);
          setFinalQuiz({
            instructions: "",
            passing_marks: 0,
          });
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      {(() => {
        if (pageNum) {
          if (pageNum === 1) {
            return (
              <Fragment>
                <div className={classes.buttonSection}>
                  <PageTitle title="Course and Chapter" />
                  <div>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => setDrawerOpen(true)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit Course Details
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setChapterDialog(true)}
                    >
                      Add New Chapter
                    </Button>
                  </div>
                </div>
                <CourseKanbanBoard
                  courseId={courseId}
                  state={allChapters}
                  setState={setAllChapters}
                  getCourse={getCourse}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setToNextPage()}
                  style={{ float: "right" }}
                >
                  Next
                </Button>
              </Fragment>
            );
          } else if (pageNum === 2) {
            return (
              <Fragment>
                <div className={classes.buttonSection}>
                  <PageTitle title="Final Quiz" />
                  <div>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => setDrawerOpen(true)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit Course Details
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => {
                        setFinalQuizDialog(true);
                        setEditMode(true);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      Edit Final Quiz Details
                    </Button>
                  </div>
                </div>
                <QuizKanbanBoard
                  finalQuiz={finalQuiz}
                  getCourse={getCourse}
                  finalQuizQuestions={finalQuizQuestions}
                  setFinalQuizQuestions={setFinalQuizQuestions}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPageNum(1)}
                    style={{ float: "right" }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setToNextPage()}
                    style={{ float: "right" }}
                  >
                    Next
                  </Button>
                </div>

                <Dialog
                  open={finalQuizDialog}
                  onClose={() => {
                    setFinalQuizDialog(false);
                  }}
                  PaperProps={{
                    style: {
                      width: "400px",
                    },
                  }}
                >
                  <DialogTitle>Final Quiz</DialogTitle>
                  <DialogContent>
                    <label htmlFor="instructions">
                      <Typography variant="body1">Instructions</Typography>
                    </label>
                    <TextField
                      id="instructions"
                      placeholder="Enter instructions"
                      type="text"
                      autoComplete="off"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={finalQuiz && finalQuiz.instructions}
                      onChange={(e) => {
                        setFinalQuiz({
                          ...finalQuiz,
                          instructions: e.target.value,
                        });
                      }}
                    />
                    <label htmlFor="marks">
                      <Typography variant="body1" style={{ marginTop: "10px" }}>
                        Marks
                      </Typography>
                    </label>
                    <TextField
                      id="marks"
                      type="number"
                      autoComplete="off"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={finalQuiz && finalQuiz.passing_marks}
                      onChange={(e) =>
                        setFinalQuiz({
                          ...finalQuiz,
                          passing_marks: e.target.value,
                        })
                      }
                      style={{ marginBottom: "10px" }}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      className={classes.dialogButtons}
                      onClick={() => {
                        setFinalQuizDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.dialogButtons}
                      // disabled={!editMode && editQuestionDialog}
                      onClick={() => {
                        handleSaveFinalQuizDetails();
                      }}
                    >
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>
              </Fragment>
            );
          } else if (pageNum === 3) {
          }
        }
      })()}

      <CourseDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        coursePicAvatar={coursePicAvatar}
        setCoursePicAvatar={setCoursePicAvatar}
        courseDetails={courseDetails}
        setCourseDetails={setCourseDetails}
        languages={languages}
        setLanguages={setLanguages}
        categories={categories}
        setCategories={setCategories}
        handleSaveCourseDetails={handleSaveCourseDetails}
        drawerPageNum={drawerPageNum}
        setDrawerPageNum={setDrawerPageNum}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        courseId={courseId}
      />
      <Dialog
        open={chapterDialog}
        onClose={() => {
          setChapterDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <form onSubmit={handleSaveChapter}>
          <DialogTitle>Create a New Chapter</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="title">
                <Typography variant="body2">Chapter Title</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Enter Chapter Title"
                value={chapterDetails && chapterDetails.title}
                onChange={(e) => {
                  setChapterDetails({
                    ...chapterDetails,
                    title: e.target.value,
                  });
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="title">
                <Typography variant="body2">Chapter Overview</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                fullWidth
                margin="dense"
                multiline
                rows={2}
                placeholder="Enter Chapter Overview"
                value={chapterDetails && chapterDetails.overview}
                onChange={(e) => {
                  setChapterDetails({
                    ...chapterDetails,
                    overview: e.target.value,
                  });
                }}
                required
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setChapterDialog(false);
                setChapterDetails({
                  title: "",
                  overview: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.dialogButtons}
              type="submit"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

export default CourseCreation;
