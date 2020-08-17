import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Axios from "axios";
import {
  Collapse,
  TextareaAutosize,
  Button,
  CardMedia,
  CardContent,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { Link, Redirect } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import CommentBox from "./CommentBox";
import Loading from "../components/Loading";
import { CONCAT_SERVER_URL } from "../utils";
import AlertDialog from "../components/AlertDialog";
import MyQuill from "../components/MyQuill";
import ErrorMsg from "../components/ErrorMsg";
import "./Content.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    boxShadow: "rgba(0,0,0,0.45) 0px 2px 10px",
    borderRadius: "30px",
    [theme.breakpoints.down("xs")]: {
      height: "90vh",
      marginTop: "0px",
    },
    [theme.breakpoints.only("sm")]: {
      height: "85vh",
      marginTop: "25px",
    },
    [theme.breakpoints.up("md")]: {
      height: "75vh",
      marginTop: "50px",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      height: "60%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "55%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      height: "100%",
    },
  },
  cover: {
    [theme.breakpoints.down("xs")]: {
      height: "40%",
      flex: "100%",
    },
    [theme.breakpoints.only("sm")]: {
      height: "45%",
      flex: "100%",
    },
    [theme.breakpoints.up("md")]: {
      flex: "50%",
      height: "100%",
    },
    cursor: "zoom-in",
  },
  coverOpen: {
    flex: "100%",
    height: "100%",
    cursor: "zoom-out",
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: "auto",
  },
  expandOpen: {
    transform: "rotate(180deg)",
    marginLeft: "auto",
  },
  input: {
    resize: "none",
    width: "90%",
    borderRadius: "20px",
    fontSize: "20px",
    alignItems: "center",
  },
  button: {
    maxHeight: "35px",
    maxWidth: "30px",
    marginLeft: "10%",
  },
  comments: {
    overflow: "auto",
    weight: "100%",
    flexGrow: "1",
    marginLeft: "5%",
    display: "flex",
  },
  comment: {
    marginLeft: "10%",
    display: "flex",
    margin: "5px",
    width: "80%",
    height: "40px",
  },
  content: {
    maxHeight: "40%",
    minHeight: "130px",
    display: "flex",
    flexDirection: "column",
    padding: "0px",
    margin: "16px 16px 0px 16px",
  },
  collapse: {
    display: "flex",
    width: "100%",
    flexGrow: "1",
    flexDirection: "column",
    overflow: "hidden",
  },
  wrapper: {
    height: "100%",
  },
  wrapperInner: {
    display: "flex",
    flexDirection: "column",
  },
  author: {
    height: "40px",
  },
  text: {
    overflow: "auto",
    flexGrow: "1",
  },
  time: {
    overflow: "hidden",
    flexGrow: "1",
  },
  cardHeader: {
    padding: 0,
  },
  action: {
    margin: 0,
  },
  subheader: {
    fontWeight: 500,
    fontSize: "0.875em",
  },
  user: {
    flexGrow: "1",
  },
  myQuill: {
    marginRight: "5%",
    width: "90%",
  },
  red: {
    color: "red",
  },
  none: {},
  cardActions: {
    padding: "0px",
  },
  likeUser: {
    fontSize: "0.7em",
    fontWeight: "450",
  },
}));

export default function ContentCard(props) {
  const {
    src,
    id,
    author,
    content,
    userId,
    username,
    refresh,
    timeAgo,
    isBucket,
  } = props;
  const classes = useStyles();
  const [error, setError] = useState({ message: "", url: "" });
  const [expand, setExpand] = useState(true);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [onDelete, setOnDelete] = useState(0);
  const [isConnectionFailed, setIsConnectionFailed] = useState(false);
  const [errMessage, setErrMessage] = useState({ title: "", message: "" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(0);
  const [newPost, setNewPost] = useState(content);
  const [likeInfo, setLikeInfo] = useState({
    id: null,
    red: false,
  });
  const [likeCount, setLikeCount] = useState({ sum: 0, likers: "" });

  function refreshLikeCount() {
    setError({ message: "", url: "" });
    Axios.get(CONCAT_SERVER_URL("/api/v1/likes/sum"), {
      params: { post_id: id },
    })
      .then((res) => {
        let likerString = "";
        if (res.data.likers.length !== 0) {
          if (res.data.likers.length === 1) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {" likes this post."}
              </div>
            );
          } else if (res.data.likers.length === 2) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {" like this post."}
              </div>
            );
          } else if (res.data.sum === 3) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[2].username}`}>
                  {res.data.likers[2].username}
                </Link>
                {" like this post."}
              </div>
            );
          } else if (res.data.sum === 4) {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[2].username}`}>
                  {res.data.likers[2].username}
                </Link>{" "}
                {`and other ${res.data.sum - 3} user
              like this post.`}
              </div>
            );
          } else {
            likerString = (
              <div className={classes.likeUser}>
                <Link to={`/profile/${res.data.likers[0].username}`}>
                  {res.data.likers[0].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[1].username}`}>
                  {res.data.likers[1].username}
                </Link>
                {", "}
                <Link to={`/profile/${res.data.likers[2].username}`}>
                  {res.data.likers[2].username}
                </Link>{" "}
                {`and other ${res.data.sum - 3} users
              like this post.`}
              </div>
            );
          }
        }
        setLikeCount({ sum: res.data.sum, likers: likerString });
      })
      .catch(() => {
        setError({
          message: "Connection Error",
          url: "/pictures/connection-error.svg",
        });
      });
  }

  function refreshComment() {
    Axios.get(CONCAT_SERVER_URL("/api/v1/comment/post"), {
      params: { post: id },
    })
      .then(({ data }) => {
        setComments(data.reverse());
        setIsUpload(false);
      })
      .catch(() => {
        setIsUpload(false);
      });
  }

  const refreshLike = () => {
    if (userId) {
      setError({ message: "", url: "" });
      Axios.get(CONCAT_SERVER_URL("/api/v1/likes"), {
        params: {
          user_id: userId,
          post_id: id,
        },
      })
        .then((res) => {
          if (res.data[0]) {
            setLikeInfo({
              id: res.data[0].id,
              red: res.data[0].deleted_at === null,
            });
          }
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        });
    }
  };

  function upload() {
    if (isBucket) {
      setErrMessage({
        title: "Bucket Error",
        message: "You cannot send comment when you in the bucket",
      });
      setIsConnectionFailed(true);
    } else {
      setIsUpload(true);
      Axios.post(CONCAT_SERVER_URL("/api/v1/comment/upload"), {
        content: value,
        user_id: userId,
        post_id: id,
        user: true,
      })
        .then(() => {
          refreshComment();
          setValue("");
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            setErrMessage({
              title: "Network Error",
              message: "Failed to send comment, pleace retry",
            });
            setIsConnectionFailed(true);
            setIsUpload(false);
          } else if (e.message === "Request failed with status code 404") {
            setIsConnectionFailed(true);
            setErrMessage({
              title: "Error",
              message: "Post is deleted",
            });
          } else if (e.message === "Request failed with status code 403") {
            setIsConnectionFailed(true);
            setErrMessage({
              title: "Bucket Error",
              message: "You cannot send comment when you in the bucket",
            });
          }
          setIsUpload(false);
        });
    }
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value !== "") upload();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && value !== "") upload();
  };

  useEffect(() => {
    refreshComment();
    refreshLike();
    refreshLikeCount();
  }, [id]);

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  const handleDelete = () => {
    setOnDelete(1);
    Axios.delete(CONCAT_SERVER_URL("/api/v1/post"), {
      data: { id },
    })
      .then(() => {
        setOnDelete(2);
      })
      .catch((e) => {
        if (e.message === "Network Error") {
          setIsConnectionFailed(true);
          setErrMessage({
            title: "Network Error",
            message: "Failed to delete post, pleace retry",
          });
        }
        setOnDelete(0);
      })
      .finally(() => {
        setIsDialogOpen(false);
      });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleLike = () => {
    setError({ message: "", url: "" });
    if (likeInfo.id !== null) {
      if (likeInfo.red) {
        Axios.delete(CONCAT_SERVER_URL(`/api/v1/likes/${likeInfo.id}`))
          .then(() => {
            setLikeInfo({
              id: likeInfo.id,
              red: false,
            });
            refreshLikeCount();
          })
          .catch(() => {
            setError({
              message: "Connection Error",
              url: "/pictures/connection-error.svg",
            });
          });
      } else {
        Axios.put(CONCAT_SERVER_URL(`/api/v1/likes/${likeInfo.id}`))
          .then(() => {
            setLikeInfo({
              id: likeInfo.id,
              red: true,
            });
            refreshLikeCount();
          })
          .catch(() => {
            setError({
              message: "Connection Error",
              url: "/pictures/connection-error.svg",
            });
          });
      }
    } else {
      Axios.post(CONCAT_SERVER_URL("/api/v1/likes"), {
        user_id: userId,
        post_id: id,
      })
        .then((res) => {
          setLikeInfo({
            id: res.data.id,
            red: true,
          });
          refreshLikeCount();
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        });
    }
  };

  async function handleEdit() {
    if (onEdit === 0) {
      setOnEdit(1);
      Axios.post(CONCAT_SERVER_URL("/api/v1/post/modification"), {
        id,
        content: newPost,
        user: true,
        user_id: userId,
      })
        .then(() => {
          setIsEditDialogOpen(false);
          refresh();
        })
        .catch(() => {
          setErrMessage({
            title: "Network Error",
            message: "Failed to edit post, pleace retry",
          });
          setIsConnectionFailed(true);
        })
        .finally(() => {
          setOnEdit(0);
        });
    }
  }

  if (onDelete === 1) {
    return <Loading />;
  }
  if (onDelete === 2) {
    return <Redirect to="/home" />;
  }
  if (onDelete === 0) {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    return (
      <Card className={classes.root}>
        <CardMedia
          className={clsx(classes.cover, {
            [classes.coverOpen]: isCoverOpen,
          })}
          image={src}
          title="Live from space album cover"
          onClick={() => {
            setIsCoverOpen(!isCoverOpen);
          }}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <CardHeader
              classes={{
                root: classes.cardHeader,
                action: classes.action,
                subheader: classes.subheader,
              }}
              title={
                <Link to={`/profile/${author}`} className={classes.user}>
                  {author}
                </Link>
              }
              subheader={timeAgo}
              action={
                author === username && (
                  <>
                    <IconButton
                      size="small"
                      onClick={handleClick}
                      aria-controls="m"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="m"
                      anchorEl={menu}
                      keepMounted
                      open={Boolean(menu)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          setMenu(false);
                          setIsDialogOpen(true);
                        }}
                      >
                        delete
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setMenu(false);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </MenuItem>
                    </Menu>
                    <AlertDialog
                      open={isDialogOpen}
                      alertTitle="Warning"
                      alertDesciption="Do you really want to delete this post?"
                      alertButton={
                        <>
                          <Button onClick={handleDelete}>Yes</Button>
                          <Button onClick={handleDialogClose}>No</Button>
                        </>
                      }
                      onClose={handleDialogClose}
                    />
                    <AlertDialog
                      open={isEditDialogOpen}
                      alertTitle="Edit Post"
                      alertButton={
                        <>
                          <Button onClick={handleEdit}>Yes</Button>
                          <Button onClick={handleEditDialogClose}>No</Button>
                        </>
                      }
                      onClose={handleEditDialogClose}
                      moreComponent={
                        <MyQuill
                          className={classes.myQuill}
                          value={newPost}
                          setValue={setNewPost}
                        />
                      }
                    />
                  </>
                )
              }
            />
            <div
              className={classes.text}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
          <CardActions disableSpacing className={classes.cardActions}>
            {userId ? (
              <IconButton onClick={handleLike}>
                <FavoriteIcon
                  className={clsx(classes.none, {
                    [classes.red]: likeInfo.red,
                  })}
                />
              </IconButton>
            ) : (
              <div style={{ width: "15px" }} />
            )}
            <div>
              <div>{`${likeCount.sum} Likes`}</div>
              {likeCount.likers}
            </div>
            <IconButton
              component="span"
              onClick={() => {
                setExpand(!expand);
              }}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expand,
              })}
              size={expand ? "small" : "medium"}
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse
            in={expand}
            classes={{
              container: classes.collapse,
              wrapper: classes.wrapper,
              wrapperInner: classes.wrapperInner,
            }}
          >
            <ScrollToBottom className={classes.comments}>
              {comments.map((i) => (
                <CommentBox
                  key={i.id}
                  author={i.user_name}
                  comment={i.content}
                  commentId={i.id}
                  canDelete={username === i.user_name || username === author}
                  canEdit={username === i.user_name}
                  refresh={refreshComment}
                  isUser={username !== null}
                  userId={userId}
                />
              ))}
            </ScrollToBottom>
            {username && (
              <form className={classes.comment}>
                <TextareaAutosize
                  id="standard-basic"
                  className={classes.input}
                  rowsMin={1}
                  rowsMax={3}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleEnter}
                />
                {isUpload ? (
                  <Loading />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOnSubmit}
                    component="span"
                    className={classes.button}
                  >
                    <SendIcon />
                  </Button>
                )}
              </form>
            )}
          </Collapse>
        </div>
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
      </Card>
    );
  }
}
