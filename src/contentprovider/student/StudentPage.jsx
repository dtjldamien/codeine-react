import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "calc(100vh - 115px)",
  },
  formControl: {
    marginLeft: theme.spacing(5),
    minWidth: 250,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  avatar: {
    fontSize: "50px",
    width: "100px",
    height: "100px",
  },
}));

const StudentPage = () => {
  const classes = useStyles();

  const formatStatus = (status) => {
    if (status) {
      return "Active";
    } else {
      return "Deactivated";
    }
  };

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

  useEffect(() => {
    getAllStudents();
    getAllCoursesByPartner();
  }, []);

  // Enrolled Course Student data
  const [allStudentList, setAllStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
  });

  const studentColumns = [
    { field: "id", headerName: "ID", width: 300 },
    {
      field: "first_name",
      headerName: "First Name",
      width: 160,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 160,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "numOfCourses",
      headerName: "No. of Courses",
      width: 160,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 160,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatStatus(params.value)}
            </Typography>
          )}
        </strong>
      ),
      width: 130,
    },
  ];

  const getListOfCourseEnrolledByStudent = (studentId) => {
    let listOfEnrolledCourses = [];

    for (let i in allStudentList) {
      if (allStudentList[i].member.id === studentId) {
        listOfEnrolledCourses.push(allStudentList[i].course);
      }
    }
    return listOfEnrolledCourses;
  };

  const removeDuplicateStudent = (arrayList) => {
    for (let i = 0; i < arrayList.length; i++) {
      arrayList[i].id = arrayList[i].member.id;
      arrayList[i].first_name = arrayList[i].member.first_name;
      arrayList[i].last_name = arrayList[i].member.last_name;
      arrayList[i].email = arrayList[i].member.email;
      arrayList[i].is_active = arrayList[i].member.is_active;
      arrayList[i].profile_photo = arrayList[i].member.profile_photo;
      arrayList[i].date_joined = arrayList[i].member.date_joined;
      arrayList[i].numOfCourses = getListOfCourseEnrolledByStudent(
        arrayList[i].member.id
      ).length;
    }

    let newArray = [];

    let uniqueStudent = {};

    for (let i in arrayList) {
      let studentID = arrayList[i].id;

      uniqueStudent[studentID] = arrayList[i];
    }

    for (let i in uniqueStudent) {
      newArray.push(uniqueStudent[i]);
    }
    return newArray;
  };

  let studentRows = removeDuplicateStudent(allStudentList);

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("None");

  const getAllStudents = (filter) => {
    let queryParams = {
      search: searchValue,
    };

    if (filter !== "None") {
      queryParams = {
        ...queryParams,
        courseId: filter,
      };
    }

    console.log("courseid: " + queryParams.courseId);

    Service.client
      .get(`/enrolled-members`, { params: { ...queryParams } })
      .then((res) => {
        console.log(res.data);
        setAllStudentList(res.data);
        studentRows = removeDuplicateStudent(allStudentList);
      })
      .catch((err) => console.log(err));
  };

  const [allCourseList, setAllCourseList] = useState([]);

  const getAllCoursesByPartner = () => {
    Service.client
      .get(`/private-courses`)
      .then((res) => {
        setAllCourseList(res.data.results);
      })
      .catch((err) => console.log(err));
  };

  const handleRequestSearch = () => {
    getAllStudents();
    setSortMethod("None");
  };

  const handleCancelSearch = () => {
    setSearchValue("");
    setSortMethod("None");
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllStudents(e.target.value);
    console.log("onsortchange: " + e.target.value);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = (e) => {
    setSelectedStudent(e.row);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={7} className={classes.searchSection}>
          <SearchBar
            style={{
              marginBottom: "20px",
            }}
            placeholder="Search Students..."
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onCancelSearch={handleCancelSearch}
            onRequestSearch={handleRequestSearch}
            className={classes.searchBar}
            classes={{
              input: classes.input,
            }}
          />
        </Grid>
        <Grid item xs={5}>
          {allCourseList && (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Filter By</InputLabel>
              <Select
                label="Sort By"
                value={sortMethod}
                onChange={(event) => {
                  onSortChange(event);
                }}
              >
                <MenuItem key={null} value={"None"}>
                  -None-
                </MenuItem>
                {allCourseList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ height: "calc(100vh - 200px)", width: "100%" }}
      >
        <DataGrid
          rows={studentRows}
          columns={studentColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          //checkboxSelection
          disableSelectionOnClick
          onRowClick={(e) => handleClickOpen(e)}
        />
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Enrolled Student Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  ID <br />
                  First Name <br />
                  Last Name <br />
                  Email <br />
                  Status <br />
                  Date Joined <br />
                  Courses Joined <br />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedStudent.id} <br />
                  {selectedStudent.first_name} <br />
                  {selectedStudent.last_name} <br />
                  {selectedStudent.email} <br />
                </Typography>
                {selectedStudent.is_active ? (
                  <Typography style={{ color: "green" }}>Active</Typography>
                ) : (
                  <Typography style={{ color: "red" }}>Deactived</Typography>
                )}{" "}
                <Typography>
                  {formatDate(selectedStudent.date_joined)} <br />
                  {getListOfCourseEnrolledByStudent(selectedStudent.id).length}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {selectedStudent.profile_photo ? (
                  <Avatar
                    src={selectedStudent.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedStudent.email.charAt(0)}
                  </Avatar>
                )}
              </Grid>
              <Grid item xs={12}>
                <List>
                  {getListOfCourseEnrolledByStudent(selectedStudent.id).map(
                    (value) => {
                      return (
                        <ListItem key={value.id}>
                          <ListItemAvatar>
                            <Avatar alt="logo" src={value.thumbnail} />
                          </ListItemAvatar>
                          <ListItemText id={value.id} primary={value.title} />
                        </ListItem>
                      );
                    }
                  )}
                </List>
              </Grid>
            </Grid>
            <br />
          </DialogContent>
        </Dialog>
      </Grid>
    </Fragment>
  );
};

export default StudentPage;
