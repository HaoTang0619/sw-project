import React /* , { useState } */ from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
// import axios from "axios";
import clsx from "clsx";
import {
  // Button,
  // IconButton,
  // Menu,
  // MenuItem,
  Paper,
  // TextField,
  Typography,
} from "@material-ui/core";
// import MoreVertIcon from "@material-ui/icons/MoreVert";

import { selectUser } from "../redux/userSlice";
import { CONCAT_SERVER_URL } from "../utils";
// import AlertDialog from "../components/AlertDialog";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "row",
    textAlign: "left",
  },
  rootByMe: {
    flexDirection: "row-reverse",
    textAlign: "right",
  },
  message: {
    minHeight: "20px",
    maxWidth: "55%",
    padding: "3px 10px",
    borderRadius: "30px",
    margin: "3px",
    display: "flex",
    background: "#fafafa",
    textAlign: "left",
  },
  messageByMe: {
    background: "#c9cfed",
  },
  avatar: {
    width: "32px",
    height: "32px",
    margin: "8px",
    padding: "1px",
    border: "2px solid #3f51b5",
    borderRadius: "25px",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
    wordBreak: "break-all",
    padding: "0",
    lineHeight: "20px",
  },
  read: {
    fontSize: "12px",
    display: "block",
    marginBottom: "-5px",
  },
  time: {
    fontSize: "14px",
    color: "#777",
    margin: "auto 2px",
  },
  newDay: {
    margin: "auto",
    background: "rgba(159, 191, 223, 0.3)",
    padding: "5px 15px",
    fontSize: "14px",
    borderRadius: "30px",
  },
  dayTime: {
    fontSize: "11px",
    display: "block",
  },
}));

export default function ChatBox(props) {
  const {
    chatInfo,
    message,
    from,
    time,
    first /* , canDelete, canEdit */,
  } = props;
  const { userId, userAvatar } = useSelector(selectUser);

  // const [menu, setMenu] = useState(null);
  // const [canEdit] = useState(false);
  // const [onDelete, setOnDelete] = useState(false);
  // const [onEdit, setOnEdit] = useState(false);
  // const [isOption] = useState(false);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  // const [newMessage, setNewMessage] = useState(message);
  // const [errMessage, setErrMessage] = useState("");
  const classes = useStyles();

  const getTimeFormat = (t) => {
    // HH:MM
    const HMS = t.split(" ")[1];
    const [HH, MM] = HMS.split(":");
    return `${HH}:${MM}`;
  };

  const addZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const month = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  const getRecentTime = (t) => {
    const day1 = new Date();
    day1.setDate(day1.getDate());
    const today = `${day1.getFullYear()}-${addZero(
      day1.getMonth() + 1
    )}-${addZero(day1.getDate())}`;
    if (t === today) return "Today";

    const day2 = new Date();
    day2.setDate(day2.getDate() - 1);
    const yesterday = `${day2.getFullYear()}-${addZero(
      day2.getMonth() + 1
    )}-${addZero(day2.getDate())}`;
    if (t === yesterday) return "Yesterday";

    const mon = month[parseInt(t.slice(5, 7), 10)];
    return `${mon} ${t.slice(8)}`;
  };

  const readOrNot = chatInfo.last_read !== null && chatInfo.last_read >= time;
  const messageTime = getTimeFormat(time);
  const date = getRecentTime(time.split(" ")[0]);

  // const handleClick = (event) => {
  //   setMenu(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setMenu(null);
  // };

  // function handleDeleteDialogClose() {
  //   setIsDeleteDialogOpen(false);
  // }

  // function handleEditDialogClose() {
  //   setIsEditDialogOpen(false);
  // }

  // const handleDelete = () => {
  //   if (!onDelete) {
  //     setOnDelete(true);
  //     axios
  //       .delete(CONCAT_SERVER_URL(`/api/v1/messages/${messageId}`), {
  //         data: {
  //           user: true,
  //         },
  //       })
  //       .then(() => {
  //         refresh();
  //       })
  //       .catch(() => {
  //         setErrMessage({
  //           title: "Network error",
  //           message: "Failed to delete the message, please retry",
  //         });
  //         setIsConnectionFailed(true);
  //       })
  //       .finally(() => {
  //         setOnDelete(false);
  //         setIsDeleteDialogOpen(false);
  //       });
  //   }
  // };

  // function handleEdit() {
  //   if (!onEdit && newMessage !== "") {
  //     setOnEdit(true);
  //     axios
  //       .post(CONCAT_SERVER_URL(`/api/v1/messages/${messageId}`), {
  //         content: newMessage,
  //         user: true,
  //         user_id: userId,
  //       })
  //       .then(() => {
  //         refresh();
  //         setIsEditDialogOpen(false);
  //       })
  //       .catch((e) => {
  //         if (e.message === "Request failed with status code 403") {
  //           setIsConnectionFailed(true);
  //           setErrMessage({
  //             title: "Bucket Error",
  //             message: "You cannot edit message when you in the bucket",
  //           });
  //         } else {
  //           setErrMessage({
  //             title: "Network error",
  //             message: "Failed to edit the message, please retry",
  //           });
  //           setIsConnectionFailed(true);
  //         }
  //       })
  //       .finally(() => {
  //         setOnEdit(false);
  //       });
  //   }
  // }

  return (
    <>
      <div
        className={clsx(classes.root, { [classes.rootByMe]: from === userId })}
      >
        <img
          alt="Avatar"
          className={classes.avatar}
          src={CONCAT_SERVER_URL(
            from === userId ? userAvatar : chatInfo.avatar_url
          )}
        />
        <Paper
          className={clsx(classes.message, {
            [classes.messageByMe]: from === userId,
          })}
        >
          <div className={classes.content}>{message}</div>
        </Paper>
        <Typography variant="h6" className={classes.time}>
          <Typography variant="button" className={classes.read}>
            {readOrNot && from === userId && "Read"}
          </Typography>
          {messageTime}
          <Typography className={classes.dayTime}>
            {date !== "Today" && date}
          </Typography>
        </Typography>
        {/* {isOption && (
        <IconButton size="small" onClick={handleClick} aria-controls="m">
          <MoreVertIcon />
        </IconButton>
      )}
      {isOption && (
        <Menu
          id="m"
          anchorEl={menu}
          keepMounted
          open={Boolean(menu)}
          onClose={handleClose}
        >
          {canEdit && (
            <MenuItem
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              delete
            </MenuItem>
          )}
          {canEdit && (
            <MenuItem
              onClick={() => {
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </MenuItem>
          )}
        </Menu>
      )}
      <AlertDialog
        open={isConnectionFailed}
        alertTitle={errMessage.title}
        alertDesciption={errMessage.message}
        alertButton={
          <>
            <Button
              onClick={() => {
                setIsConnectionFailed(false);
              }}
            >
              Got it!
            </Button>
          </>
        }
        onClose={() => {
          setIsConnectionFailed(false);
        }}
      />
      <AlertDialog
        open={isEditDialogOpen}
        alertTitle="Edit message"
        alertButton={
          <>
            <Button onClick={handleEdit}>Yes</Button>
            <Button onClick={handleEditDialogClose}>No</Button>
          </>
        }
        onClose={handleEditDialogClose}
        moreComponent={
          <TextField
            className={classes.TextField}
            multiline
            rowsMax={4}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
        }
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        alertTitle="Warning"
        alertDesciption="You are trying to delete a message"
        alertButton={
          <>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={handleDeleteDialogClose}>No</Button>
          </>
        }
        onClose={handleDeleteDialogClose}
      /> */}
      </div>
      {first && <Paper className={classes.newDay}>{date}</Paper>}
    </>
  );
}
