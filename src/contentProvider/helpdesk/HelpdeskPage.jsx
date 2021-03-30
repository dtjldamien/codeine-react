import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import PageTitle from "../../components/PageTitle.js";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  contactUs: {
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
}));

const FAQ = [
  {
    question: "How Do I Edit My Email Address?",
    answer:
      "To edit your email address, select your avatar icon at the top of the page and click on 'Manage Your Profile' from the dropdown menu to edit your email address.",
  },
  {
    question: "How Do I Change My Password?",
    answer:
      "To change your password, select your avatar icon at the top of the page and click on 'Manage Your Profile' from the dropdown menu to access your profile. At that page, click on 'Change Password' to change your password.",
  },
  {
    question: "How Do I Upgrade To Pro-Tier Membership?",
    answer: `To upgrade to Pro-Tier, click on 'Upgrade' at the top of the page. You will be brought to a page where you can see our pricing plan and choose the number of months to be in the Pro-Tier.`,
  },
  {
    question: "How Do I Extend My Pro-Tier Membership?",
    answer: `To extend your Pro-Tier membership, select your avatar icon at the top of the page and click on 'My Payments' from the dropdown menu. At that page, click on 'Extend Pro-Tier Membership' to extend your membership.`,
  },
  {
    question: "Where Can I Find My Enrolled Courses?",
    answer: `To get the list of your enrolled courses, select your avatar icon at the top of the page and click on 'Courses' from the dropdown menu. You will be able to see all the courses that you have enrolled in.`,
  },
  {
    question: "Where Can I Get Help With Course Content?",
    answer: `You can get help from your course instructor in the discussion forum within that course. Alternatively, you could apply for an online consultation with the course instructor.`,
  },
];

const HelpdeskPage = () => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PageTitle title="Helpdesk" />
        <Button variant="outlined" color="primary">
          View Submitted Issues
        </Button>
      </div>
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
          color: "#437FC7",
        }}
      >
        Common FAQs
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          margin: "auto",
        }}
      >
        {FAQ &&
          FAQ.length > 0 &&
          FAQ.map((faq, index) => {
            return (
              <Accordion
                expanded={expanded === `${index}`}
                onChange={handleChange(`${index}`)}
                key={`${index}`}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  id={`${index}`}
                  style={{ backgroundColor: "#F4F4F4" }}
                >
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </div>
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          paddingTop: "50px",
          paddingBottom: "20px",
        }}
      >
        Can't find what you're looking for?
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          className={classes.contactUs}
          component={Link}
          to="/partner/home/helpdesk/contact-us"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default HelpdeskPage;
