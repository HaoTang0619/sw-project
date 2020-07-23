import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LoginForm from "./LoginForm";

const useStyles = makeStyles(() => ({
  Background: {
    backgroundImage: "url(picture/desktop.png)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    height: "100vh",
  },
  homePage: {
    position: "relative",
    color: "white",
    "font-size": "72px",
    "font-weight": "600",
  },

  itemFormat: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },

  titleTEXT: {
    width: "365px",
    minWidth: "365px",
  },

  formTEXT: {
    height: "90%",
  },

  pageSetting: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "675px",
    overflow: "hidden",
  },
}));

export default function LoginPage() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.Background}>
        <div className={classes.itemFormat}>
          <div className={classes.pageSetting}>
            <div className={classes.titleTEXT}>
              <div className={classes.itemFormat}>
                <p className={classes.homePage}>
                  Sign up to enjoy your new day
                </p>
              </div>
            </div>
            <div style={{ width: "10%" }} />
            <div className={classes.formTEXT}>
              <div className={classes.itemFormat}>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
