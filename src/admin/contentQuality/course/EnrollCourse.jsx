import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";

import Service from "../../../AxiosService";
import Cookies from "js-cookie";
import {
  Announcement,
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import ReactPlayer from "react-player";

import TakeQuiz from "./components/TakeQuiz";
// import Toast from "../../../components/Toast.js";
import jwt_decode from "jwt-decode";
import CommentsSection from "./components/CommentsSection";
// import calculate from "./components/CalculateDuration";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  unenrollButton: {
    marginLeft: "25px",
    marginRight: "25px",
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      color: "#000",
    },
  },
  dialogButtons: {
    width: 100,
  },
  courseSection: {
    display: "flex",
    marginTop: "15px",
  },
  content: {
    minHeight: 400,
    padding: theme.spacing(3),
    // backgroundColor: "#000",
  },
  courseContent: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  requirements: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  descriptionSection: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  reviews: {},
  linkMui: {
    cursor: "pointer",
  },
}));

const EnrollCourse = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  // const [loggedIn, setLoggedIn] = useState(false);
  const [course, setCourse] = useState();
  // const [givenCourseReview, setGivenCourseReview] = useState(false);

  const [chosenCourseMaterial, setChosenCourseMaterial] = useState();

  const [expanded, setExpanded] = useState("overview");

  //const [unenrollDialog, setUnenrollDialog] = useState(false);
  //const [reviewDialog, setReviewDialog] = useState(false);

  // const [review, setReview] = useState({
  //   rating: 0,
  //   description: "",
  // });

  const [pageNum, setPageNum] = useState(-1);
  const [resultObj, setResultObj] = useState();

  const [progressArr, setProgressArr] = useState([]);
  const [progress, setProgress] = useState(0);

  const ref = React.createRef();

  const handleChange = (panel) => (event, isExpanded) => {
    // console.log(isExpanded);
    setExpanded(isExpanded ? panel : false);
  };

  // const checkIfLoggedIn = () => {
  //   if (Cookies.get("t1")) {
  //     setLoggedIn(true);
  //   }
  // };

  const getCourse = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get(`/private-courses/${id}`)
        .then((res) => {
          // console.log(res);
          setCourse(res.data);
          setChosenCourseMaterial({
            material_type: "INTRO",
            introduction_video_url: res.data.introduction_video_url,
          });

          // Service.client
          //   .get(`enrollments`, { params: { courseId: id } })
          //   .then((res) => {
          //     console.log(res);
          //     setProgress(res.data[0].progress);
          //     if (!res.data[0].materials_done) {
          //       setProgressArr([]);
          //     } else {
          //       setProgressArr(res.data[0].materials_done);
          //     }
          //   })
          //   .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  const getCourseReviews = () => {
    const decoded = jwt_decode(Cookies.get("t1"));
    Service.client
      .get(`/courses/${id}/reviews`)
      .then((res) => {
        // console.log(res);
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].member.id === decoded.user_id) {
              // setGivenCourseReview(true);
              break;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };
  console.log(course);

  useEffect(() => {
    // checkIfLoggedIn();
    getCourse();
    getCourseReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleSubmitReview = () => {
  //   if (review.rating === 0 || review.description === "") {
  //     setSbOpen(true);
  //     setSnackbar({
  //       message: "Please give a rating and description for the review!",
  //       severity: "error",
  //       anchorOrigin: {
  //         vertical: "bottom",
  //         horizontal: "center",
  //       },
  //       autoHideDuration: 3000,
  //     });
  //     return;
  //   }

  //   Service.client
  //     .post(`/courses/${id}/reviews`, review)
  //     .then((res) => {
  //       console.log(res);
  //       setReviewDialog(false);
  //       setSbOpen(true);
  //       setSnackbar({
  //         message: "Course review submitted successfully!",
  //         severity: "success",
  //         anchorOrigin: {
  //           vertical: "bottom",
  //           horizontal: "center",
  //         },
  //         autoHideDuration: 3000,
  //       });
  //       return;
  //     })
  //     .catch((err) => console.log(err));
  // };

  const handleChosenCourseMaterial = (material) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log(material);
    setChosenCourseMaterial(material);
  };

  const handleDuration = (duration) => {
    // console.log(duration);
  };

  const handleVideoProgress = (state, videoId) => {
    // console.log(state);
    // console.log(videoId);
    if (progressArr.includes(videoId)) {
      return;
    }

    if (state.played >= 0.9) {
      // console.log("FINISH");

      let arr = [...progressArr];
      arr.push(videoId);
      setProgressArr(arr);
      Service.client
        .patch(`/courses/${id}/enrollments`, arr)
        .then((res) => {
          console.log(res);
          setProgress(res.data.progress);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCreateQuizResult = (quizId) => {
    setPageNum(-1);
    // Service.client
    //   .post(`/quiz/${quizId}/results`)
    //   .then((res) => {
    //     console.log(res);
    //     setResultObj(res.data);

    //     if (res.data.passed) {
    //       setPageNum(res.data.quiz_answers && res.data.quiz_answers.length);
    //     } else {
    //       setPageNum(-1);
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  // const handleCheckMaterial = (e, materialId) => {
  //   let arr = [];
  //   if (progressArr.length > 0) {
  //     arr = [...progressArr];
  //   }

  //   if (e.target.checked) {
  //     arr.push(materialId);
  //     setProgressArr(arr);
  //   } else {
  //     arr = arr.filter((id) => id !== materialId);
  //     console.log(arr);
  //     setProgressArr(arr);
  //   }

  //   Service.client
  //     .patch(`/courses/${id}/enrollments`, arr)
  //     .then((res) => {
  //       console.log(res);
  //       setProgress(res.data.progress);
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <div className={classes.root}>
      <div className={classes.mainSection}>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            onClick={() => history.push(`/admin/contentquality/courses/${id}`)}
          >
            <ArrowBack />
          </IconButton>
          {/* <div>
            {givenCourseReview && givenCourseReview ? (
              <Button variant="contained" color="primary" disabled>
                Course Review Given
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setReviewDialog(true)}
              >
                Give Course Review
              </Button>
            )}
          </div> */}
        </div>
        <div className={classes.courseSection}>
          <div style={{ width: "60%" }}>
            {(() => {
              if (!chosenCourseMaterial) {
                return (
                  <Paper
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <Announcement fontSize="large" />
                    <Typography variant="body1">
                      Choose a course material on the right to start
                    </Typography>
                  </Paper>
                );
              } else if (chosenCourseMaterial.material_type === "VIDEO") {
                return (
                  <div>
                    <ReactPlayer
                      ref={ref}
                      url={
                        chosenCourseMaterial &&
                        chosenCourseMaterial.video.video_url
                      }
                      width="100%"
                      height="500px"
                      onDuration={handleDuration}
                      onProgress={(state) =>
                        handleVideoProgress(state, chosenCourseMaterial.id)
                      }
                      controls
                    />
                  </div>
                );
              } else if (
                chosenCourseMaterial.material_type === "QUIZ" ||
                chosenCourseMaterial.material_type === "FINAL"
              ) {
                return (
                  <div>
                    <TakeQuiz
                      quiz={
                        chosenCourseMaterial.quiz && chosenCourseMaterial.quiz
                      }
                      quizTitle={
                        chosenCourseMaterial.title && chosenCourseMaterial.title
                      }
                      quizType={chosenCourseMaterial.material_type}
                      pageNum={pageNum}
                      setPageNum={setPageNum}
                      resultObj={resultObj}
                      setResultObj={setResultObj}
                      handleCreateQuizResult={handleCreateQuizResult}
                      materialId={chosenCourseMaterial.id}
                      progressArr={progressArr}
                      setProgressArr={setProgressArr}
                      courseId={id}
                      progress={progress}
                      setProgress={setProgress}
                    />
                  </div>
                );
              } else if (chosenCourseMaterial.material_type === "INTRO") {
                return (
                  <div>
                    <ReactPlayer
                      ref={ref}
                      url={chosenCourseMaterial.introduction_video_url}
                      width="100%"
                      height="500px"
                      onDuration={handleDuration}
                      controls
                    />
                  </div>
                );
              } else {
                return null;
              }
            })()}
            {chosenCourseMaterial &&
              chosenCourseMaterial.material_type !== "FINAL" &&
              chosenCourseMaterial.material_type !== "INTRO" && (
                <div style={{ marginTop: "20px" }}>
                  <CommentsSection materialId={chosenCourseMaterial.id} />
                </div>
              )}
          </div>
          <div style={{ width: "5%" }} />
          <div style={{ width: "35%" }}>
            {/* <Typography variant="h6">Your Progress</Typography>
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2">
                    {progress && parseInt(progress).toFixed() + "%"}
                  </Typography>
                </Box>
              </Box>
            </div> */}

            <Accordion
              expanded={expanded === `overview`}
              onChange={handleChange(`overview`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                id={`overview`}
                style={{ backgroundColor: "#F4F4F4" }}
              >
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Course Overview
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                }}
              >
                <Typography variant="body1" style={{ paddingBottom: "20px" }}>
                  {course && course.description}
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Movie fontSize="small" style={{ marginRight: "5px" }} />
                  <LinkMui
                    className={classes.linkMui}
                    onClick={() => {
                      setChosenCourseMaterial({
                        material_type: "INTRO",
                        introduction_video_url: course.introduction_video_url,
                      });
                    }}
                  >
                    Introduction Video
                  </LinkMui>
                </div>

                {/* {calculate.CalculateDuration(
                  course && course.introduction_video_url
                )} */}
              </AccordionDetails>
            </Accordion>
            {course &&
              course.chapters.length > 0 &&
              course.chapters.map((chapter, index) => {
                return (
                  <Accordion
                    expanded={expanded === `${index}`}
                    key={index}
                    onChange={handleChange(`${index}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      id={`${index}`}
                      style={{
                        backgroundColor: "#F4F4F4",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                          {chapter.title}
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{ paddingBottom: "20px" }}
                      >
                        {chapter.overview && chapter.overview}
                      </Typography>
                      {chapter.course_materials &&
                        chapter.course_materials.length > 0 &&
                        chapter.course_materials.map((material, index) => {
                          if (material.material_type === "FILE") {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  marginBottom: "20px",
                                }}
                              >
                                {/* <Checkbox
                                  style={{ marginBottom: "20px" }}
                                  checked={
                                    progressArr &&
                                    progressArr.length > 0 &&
                                    progressArr.includes(material.id)
                                  }
                                  onChange={(e) =>
                                    handleCheckMaterial(e, material.id)
                                  }
                                /> */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      minWidth: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {`${index + 1}.`}
                                    </Typography>

                                    <AttachFile fontSize="small" />
                                    <LinkMui
                                      className={classes.linkMui}
                                      onClick={() =>
                                        handleChosenCourseMaterial(material)
                                      }
                                    >
                                      {material.title}
                                    </LinkMui>
                                    <div
                                      style={{ marginLeft: "auto", order: 2 }}
                                    >
                                      {material.course_file.zip_file &&
                                        material.course_file.zip_file && (
                                          <Button
                                            variant="outlined"
                                            style={{
                                              textTransform: "capitalize",
                                              height: 25,
                                            }}
                                            href={material.course_file.zip_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download File
                                          </Button>
                                        )}
                                      {material.course_file.google_drive_url &&
                                        material.course_file
                                          .google_drive_url && (
                                          <Button
                                            variant="outlined"
                                            style={{
                                              textTransform: "capitalize",
                                              height: 25,
                                              marginLeft: "10px",
                                            }}
                                            href={
                                              material.course_file
                                                .google_drive_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            File URL
                                          </Button>
                                        )}
                                    </div>
                                  </div>
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                      marginTop: "5px",
                                    }}
                                  >
                                    {material.description}
                                  </Typography>
                                </div>
                              </div>
                            );
                          } else if (material.material_type === "VIDEO") {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  marginBottom: "20px",
                                }}
                              >
                                {/* <Checkbox
                                  style={{ marginBottom: "20px" }}
                                  checked={
                                    progressArr &&
                                    progressArr.length > 0 &&
                                    progressArr.includes(material.id)
                                  }
                                  onChange={(e) =>
                                    handleCheckMaterial(e, material.id)
                                  }
                                /> */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      // alignItems: "center",
                                      minWidth: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {`${index + 1}.`}
                                    </Typography>
                                    <Movie
                                      fontSize="small"
                                      style={{ marginRight: "5px" }}
                                    />
                                    <LinkMui
                                      className={classes.linkMui}
                                      onClick={() =>
                                        handleChosenCourseMaterial(material)
                                      }
                                    >
                                      {material.title}
                                    </LinkMui>
                                  </div>
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                    }}
                                  >
                                    {material.description}
                                  </Typography>
                                </div>
                              </div>
                            );
                          } else if (material.material_type === "QUIZ") {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  marginBottom: "20px",
                                }}
                              >
                                {/* <Checkbox
                                  style={{ marginBottom: "20px" }}
                                  checked={
                                    progressArr &&
                                    progressArr.length > 0 &&
                                    progressArr.includes(material.id)
                                  }
                                  onChange={(e) =>
                                    handleCheckMaterial(e, material.id)
                                  }
                                /> */}
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      minWidth: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {`${index + 1}.`}
                                    </Typography>
                                    <Assignment
                                      fontSize="small"
                                      style={{ marginRight: "5px" }}
                                    />
                                    <LinkMui
                                      className={classes.linkMui}
                                      onClick={() => {
                                        handleChosenCourseMaterial(material);
                                        handleCreateQuizResult(
                                          material.quiz.id
                                        );
                                      }}
                                    >
                                      {material.title}
                                    </LinkMui>
                                    <Typography
                                      variant="body2"
                                      style={{
                                        marginLeft: "auto",
                                        order: 2,
                                      }}
                                    >
                                      {material.quiz &&
                                        material.quiz.questions.length +
                                          ` Questions`}
                                    </Typography>
                                  </div>
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                    }}
                                  >
                                    {material.description}
                                  </Typography>
                                </div>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            <Accordion
              expanded={expanded === `final`}
              onChange={handleChange(`final`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                id={`final`}
                style={{ backgroundColor: "#F4F4F4" }}
              >
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Final Quiz
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <Assignment fontSize="small" style={{ marginRight: "5px" }} />
                <LinkMui
                  className={classes.linkMui}
                  onClick={() => {
                    handleChosenCourseMaterial({
                      material_type: "FINAL",
                      quiz: course.assessment,
                      id: course.assessment.id,
                    });
                    handleCreateQuizResult(course.assessment.id);
                  }}
                >
                  Attempt Final Quiz
                </LinkMui>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      {/* <Dialog
        open={unenrollDialog}
        onClose={() => setUnenrollDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Unenroll from this course?</DialogTitle>
        <DialogContent>
          You will not be able to access the course contents after unenrollment.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setUnenrollDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              // to call unenroll endpoint
              history.push(`/courses/${id}`);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reviewDialog}
        onClose={() => setReviewDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Course Review</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ paddingBottom: "5px" }}>
            Give Rating
          </Typography>

          <Rating
            value={review && review.rating}
            onChange={(event, newValue) => {
              setReview({
                ...review,
                rating: newValue,
              });
            }}
            style={{ marginBottom: "20px" }}
          />
          <label htmlFor="description">
            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              Give Review Description
            </Typography>
          </label>
          <TextField
            id="description"
            variant="outlined"
            margin="dense"
            value={review && review.description}
            onChange={(e) =>
              setReview({
                ...review,
                description: e.target.value,
              })
            }
            fullWidth
            placeholder="Enter review description"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setReviewDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmitReview();
            }}
          >
            Give Review
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default EnrollCourse;
