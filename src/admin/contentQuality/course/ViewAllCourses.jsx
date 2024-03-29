import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { useHistory } from "react-router-dom";
import Footer from "../landing/Footer";

import SearchBar from "material-ui-search-bar";
import PageTitle from "../../components/PageTitle";

import Service from "../../AxiosService";
import Cookies from "js-cookie";

import components from "./components/NavbarComponents";
import { Rating } from "@material-ui/lab";
import { NoteAdd } from "@material-ui/icons";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  courses: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 130px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
  },
  title: {
    paddingTop: theme.spacing(3),
  },
  cards: {
    display: "flex",
    flexDirection: "row",
    paddingTop: theme.spacing(2),
  },
  cardRoot: {
    width: 200,
    marginRight: "40px",
  },
  cardMedia: {
    height: 0,
    paddingTop: "56.25%",
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  searchBar: {
    width: 350,
  },
  input: {
    fontWeight: 600,
  },
  formControl: {
    marginLeft: theme.spacing(5),
    minWidth: 120,
    maxHeight: 50,
  },
  paginationSection: {
    float: "right",
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
  },
  pagination: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      size: "small",
    },
  },
}));

const ViewAllCourses = () => {
  const classes = styles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sortMethod, setSortMethod] = useState("");

  const [allCourses, setAllCourses] = useState([]);
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allCourses.length / itemsPerPage)
  );

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllCourses = (sort) => {
    let queryParams = {
      search: searchValue,
    };
    console.log(sort);

    if (sort !== undefined) {
      if (sort === "rating" || sort === "-rating") {
        queryParams = {
          ...queryParams,
          sortRating: sort,
        };
      }

      if (sort === "published_date" || sort === "-published_date") {
        queryParams = {
          ...queryParams,
          sortDate: sort,
        };
      }
    } else {
      if (sortMethod === "rating" || sortMethod === "-rating") {
        queryParams = {
          ...queryParams,
          sortRating: sortMethod,
        };
      }

      if (sortMethod === "published_date" || sortMethod === "-published_date") {
        queryParams = {
          ...queryParams,
          sortDate: sortMethod,
        };
      }
    }

    Service.client
      .get(`/courses`, { params: { ...queryParams } })
      .then((res) => {
        // console.log(res);
        setAllCourses(res.data.results);
        setNumPages(Math.ceil(res.data.results.length / itemsPerPage));
      })
      .catch((err) => console.log(err));
  };
  console.log(allCourses);

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllCourses(e.target.value);
  };

  const handleRequestSearch = () => {
    getAllCourses();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    checkIfLoggedIn();
    getAllCourses();
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getAllCourses();
    } // eslint-disable-next-line
  }, [searchValue]);

  return (
    <div className={classes.root}>
      <Navbar
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={
          loggedIn && loggedIn
            ? components.loggedInNavbar(() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              })
            : components.memberNavbar
        }
      />
      <div className={classes.courses}>
        <div className={classes.title}>
          <PageTitle title="All Courses" />
        </div>
        <div className={classes.searchSection}>
          <SearchBar
            placeholder="Search for Courses"
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onCancelSearch={handleCancelSearch}
            onRequestSearch={handleRequestSearch}
            className={classes.searchBar}
            classes={{
              input: classes.input,
            }}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Sort By</InputLabel>
            <Select
              label="Sort By"
              value={sortMethod}
              onChange={(event) => {
                onSortChange(event);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="-published_date">
                Published Date (Least Recent)
              </MenuItem>
              <MenuItem value="published_date">
                Published Date (Most Recent)
              </MenuItem>
              <MenuItem value="rating">Rating (Ascending)</MenuItem>
              <MenuItem value="-rating">Rating (Descending)</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={classes.cards}>
          {allCourses && allCourses.length > 0 ? (
            allCourses
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((course, index) => {
                return (
                  <Card key={index} className={classes.cardRoot}>
                    <CardActionArea
                      onClick={() => {
                        history.push(`/courses/${course.id}`);
                      }}
                    >
                      <CardMedia
                        className={classes.cardMedia}
                        image={course.thumbnail && course.thumbnail}
                        title={course && course.title}
                      />
                      <CardContent>
                        <Typography variant="h6">{course.title}</Typography>
                        <br />
                        <Typography
                          variant="body2"
                          style={{ opacity: 0.7, paddingBottom: "10px" }}
                        >
                          {course.partner && course.partner.first_name}{" "}
                          {course.partner && course.partner.last_name}
                        </Typography>
                        <Rating
                          size="small"
                          readOnly
                          value={
                            course && course.rating
                              ? parseFloat(course.rating)
                              : 0
                          }
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })
          ) : (
            <div
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <NoteAdd fontSize="large" />
              <Typography variant="h5">No Courses Found</Typography>
            </div>
          )}
        </div>
        <div className={classes.paginationSection}>
          {allCourses && allCourses.length > 0 && (
            <Pagination
              count={noOfPages}
              page={page}
              onChange={handlePageChange}
              defaultPage={1}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              className={classes.pagination}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllCourses;
