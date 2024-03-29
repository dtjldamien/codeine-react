import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Button,
  IconButton,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Paper,
  Link,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import SearchBar from "material-ui-search-bar";
// import jwt_decode from "jwt-decode";
import { format } from "date-fns";

import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  avatar: {
    fontSize: "30px",
    width: "80px",
    height: "80px",
    margin: `${theme.spacing(1)}px auto`,
    backgroundColor: theme.palette.primary.light,
  },
  rejectButton: {
    color: theme.palette.error.main,
    margin: theme.spacing(0.5),
  },

  containedRejectButton: {
    backgroundColor: theme.palette.error.main,
    color: "#FFF",
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
    margin: theme.spacing(0.5),
  },
  dialogContent: {
    justifyContent: "center",
  },
  dialogPaper: {
    width: "300px",
  },
  dialogTitle: {
    padding: "16px 24px 8px",
  },
  header: {
    color: theme.palette.grey[700],
    margin: `${theme.spacing(2)}px 0`,
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: "100%",
  },
  formControl: {
    marginLeft: theme.spacing(5),
    width: "250px",
    maxHeight: 50,
  },
  searchBar: {
    width: "75%",
  },
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
}));

const getDate = (date) => format(new Date(date), "dd/MM/yyyy");
const getTime = (date) => format(new Date(date), "HH:mm");

const ConsultationApplication = ({ handleGetAllConsultations }) => {
  const classes = styles();

  //Toast message
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
  const currentDate = new Date().toISOString();

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState();
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  useEffect(() => {
    if (searchValue === "") {
      getApplicationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleClickOpenApplication = (e) => {
    setSelectedApplication(e.row);
    setOpenApplicationDialog(true);
  };

  const handleCloseReject = () => {
    setOpenRejectDialog(false);
  };

  const handleCloseApplication = () => {
    setOpenApplicationDialog(false);
  };

  const handleReject = (applicationId) => {
    setOpenRejectDialog(false);
    setOpenApplicationDialog(false);
    rejectConsultation(applicationId);
  };

  const handleRequestSearch = () => {
    getApplicationData();
    setSortMethod("None");
  };

  const handleCancelSearch = () => {
    setSearchValue("");
    setSortMethod("None");
  };

  const getApplicationData = (sort) => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      let queryParams = {
        search: searchValue,
      };

      if (sort !== undefined) {
        if (sort === "upcoming") {
          queryParams = {
            ...queryParams,
            is_upcoming: "True",
          };
        }
        if (sort === "past") {
          queryParams = {
            ...queryParams,
            is_past: "True",
          };
        }
      }

      Service.client
        .get("/consultations/partner/applications", {
          params: { ...queryParams },
        })
        .then((res) => {
          console.log(res.data);
          setApplications(
            res.data.map((application) => ({
              ...application.consultation_slot,
              ...application.member,
              ...application,
              member_name: `${application.member.first_name} ${application.member.last_name}`,
            }))
          );
        })
        .catch((error) => {
          setApplications(null);
        });
    }
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getApplicationData(e.target.value);
  };

  const rejectConsultation = (applicationId) => {
    Service.client
      .patch(`/consultations/application/${applicationId}/reject`)
      .then((res) => {
        if (selectedApplication.consultation_payments.length > 0) {
          Service.client
            .post(
              `/consultations/payment/${selectedApplication.consultation_payments[0].id}/refund`
            )
            .then((res) => {
              // console.log(res);
              setSnackbar({
                ...snackbar,
                message: "Member has been removed from consultation",
                severity: "success",
              });
              setSbOpen(true);

              getApplicationData();
              handleGetAllConsultations();
            })
            .catch((err) => {
              console.log(err);
              setSnackbar({
                ...snackbar,
                message:
                  "Something went wrong, contact Help Center for support",
                severity: "error",
              });
              setSbOpen(true);
            });
        } else {
          setSnackbar({
            ...snackbar,
            message: "Member has been removed from consultation",
            severity: "success",
          });
          setSbOpen(true);

          getApplicationData();
          handleGetAllConsultations();
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({
          ...snackbar,
          message: "Something went wrong, contact Help Center for support",
          severity: "error",
        });
        setSbOpen(true);
      });

    // console.log("Application is deleted");
  };

  const formatStatus = (row) => {
    if (row.is_cancelled) {
      return "Cancelled";
    }
    if (row.is_rejected) {
      return "Rejected";
    }
    return "Accepted";
  };

  const formatColor = (row) => {
    if (row.is_cancelled) {
      return "orange";
    }
    if (row.is_rejected) {
      return "red";
    }
    return "green";
  };

  const applicationsColumns = [
    {
      field: "end_time",
      headerName: "Date",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">{getDate(params.value)}</Typography>
      ),
    },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">{getTime(params.value)}</Typography>
      ),
    },
    { field: "title", headerName: "Consultation", width: 200 },
    {
      field: "member_name",
      headerName: "Applicant",
      width: 200,
    },
    {
      field: "is_rejected",
      headerName: "Status",
      renderCell: (params) => (
        <strong>
          <Typography
            variant="body2"
            style={{ color: formatColor(params.row) }}
          >
            {formatStatus(params.row)}
          </Typography>
        </strong>
      ),
      width: 130,
      flex: 1,
    },
  ];

  // console.log(applications);

  return (
    <div style={{ minHeight: "70vh" }}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Typography
        variant="h4"
        style={{ marginBottom: "5px", color: "#437FC7" }}
      >
        Consultation Applications
      </Typography>
      <Typography
        variant="body1"
        style={{ marginBottom: "30px", color: "#000000" }}
      >
        Click on the respective applications below to view application details.
      </Typography>
      <Grid item xs={12} className={classes.searchSection}>
        <div className={classes.searchBar}>
          <SearchBar
            placeholder="Search applications..."
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onRequestSearch={handleRequestSearch}
            onCancelSearch={handleCancelSearch}
            classes={{
              input: classes.input,
            }}
          />
        </div>
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel style={{ top: -4 }}>Filter by</InputLabel>
            <Select
              label="Filter by"
              value={sortMethod}
              onChange={(event) => {
                onSortChange(event);
              }}
              style={{ height: 47, backgroundColor: "#fff" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="upcoming">Upcoming Consultations</MenuItem>
              <MenuItem value="past">Past Applications</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Grid>
      <Paper style={{ height: "650px", width: "100%", marginTop: "20px" }}>
        <DataGrid
          className={classes.dataGrid}
          rows={applications}
          columns={applicationsColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          disableSelectionOnClick
          onRowClick={(e) => handleClickOpenApplication(e)}
        />
      </Paper>

      <Dialog
        open={openApplicationDialog}
        onClose={handleCloseApplication}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
          Details
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseApplication}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {selectedApplication && (
          <DialogContent className={classes.dialogContent}>
            <Typography className={classes.header} variant="body2">
              Applicant:
            </Typography>
            <Avatar
              className={classes.avatar}
              src={
                selectedApplication && selectedApplication.member.profile_photo
                  ? selectedApplication.member.profile_photo
                  : null
              }
            >
              {selectedApplication &&
                selectedApplication.member.first_name.charAt(0)}
            </Avatar>
            <Typography
              variant="h6"
              style={{ textAlign: "center", marginRight: "0 auto" }}
            >
              {selectedApplication && selectedApplication.member_name}
            </Typography>
            <Link
              href={`mailto:${
                selectedApplication && selectedApplication.member.email
              }`}
            >
              <Typography
                variant="body1"
                style={{ textAlign: "center", marginRight: "0 auto" }}
              >
                {selectedApplication && selectedApplication.member.email}
              </Typography>
            </Link>

            <Typography className={classes.header} variant="body2">
              Consultation Details:
            </Typography>
            <Typography variant="body1">
              <b>Date:</b> {getDate(selectedApplication.start_time)}
            </Typography>
            <Typography variant="body1">
              <b>Time Slot:</b> {getTime(selectedApplication.start_time)} to{" "}
              {getTime(selectedApplication.end_time)}
            </Typography>
            <Typography variant="body1">
              <b>Status:</b>
              <Chip
                style={{
                  backgroundColor: formatColor(selectedApplication),
                  color: "#fff",
                  margin: 8,
                  padding: 8,
                }}
                label={formatStatus(selectedApplication)}
              />
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            disabled={
              (selectedApplication && selectedApplication.is_rejected) ||
              (selectedApplication &&
                selectedApplication.end_time < currentDate) ||
              (selectedApplication && selectedApplication.is_cancelled)
            }
            className={classes.rejectButton}
            onClick={() => setOpenRejectDialog(true)}
          >
            Reject
          </Button>
          <Button
            color="primary"
            href={selectedApplication && selectedApplication.meeting_link}
          >
            Go To Meeting
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseReject}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions style={{ margin: 8 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenRejectDialog(false)}
          >
            Cancel
          </Button>
          <Button
            className={classes.containedRejectButton}
            variant="contained"
            onClick={(e) => handleReject(selectedApplication.id)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConsultationApplication;
