import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { fade, makeStyles } from "@material-ui/core/styles";
import { AppBar, InputBase, Toolbar, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { selectUser } from "../redux/userSlice";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    zIndex: 1000,
  },
  title: {
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "18ch",
      "&:focus": {
        width: "36ch",
      },
    },
    [`@media screen and (min-width: 600px) and (max-width: 960px)`]: {
      width: "18ch",
      "&:focus": {
        width: "36ch",
      },
    },
  },
  offset: theme.mixins.toolbar,
}));

export default function Bar() {
  const { userId } = useSelector(selectUser);
  const [, page, tag] = window.location.pathname.split("/");

  // Classes & States
  const classes = useStyles();
  const history = useHistory();

  const [announcement, setAnnouncement] = useState({
    content: "",
    type: "",
  });

  const [chatCount, setChatCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  const [isAnOpen, setIsAnOpen] = useState(false);

  const [searchValue, setSearchValue] = useState(page === "home" ? tag : "");

  // Broadcast
  useEffect(() => {
    if (window.Echo === undefined) return () => {};

    window.Echo.channel("Announcements").listen("Announced", (event) => {
      const { data } = event;
      setAnnouncement({
        content: [
          {
            message: [
              {
                id: 0,
                created_at: Date.now(),
                ...data,
              },
            ],
          },
        ],
        type: "notes",
      });
      setIsAnOpen(true);
    });

    return () =>
      window.Echo.channel("Announcements").stopListening("Announced");
  }, [userId]);

  const handleSearch = (e) => {
    if (e.key === "Enter") history.push(`/home/${e.target.value}`);
  };

  const handleSetSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  // The bar
  return (
    <div className={classes.grow}>
      <AppBar className={classes.root} position="fixed">
        <Toolbar>
          <Link to="/home">
            <Typography className={classes.title} variant="h6" noWrap>
              SW
            </Typography>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onKeyUp={handleSearch}
              onChange={handleSetSearchValue}
              value={searchValue}
            />
          </div>
          <div className={classes.grow} />
          <DesktopMenu
            anContent={announcement.content}
            anType={announcement.type}
            chatCount={chatCount}
            isAnOpen={isAnOpen}
            notesCount={notesCount}
            setChatCount={setChatCount}
            setIsAnOpen={setIsAnOpen}
            setNotesCount={setNotesCount}
          />
          <MobileMenu
            anContent={announcement.content}
            anType={announcement.type}
            chatCount={chatCount}
            isAnOpen={isAnOpen}
            notesCount={notesCount}
            setChatCount={setChatCount}
            setIsAnOpen={setIsAnOpen}
            setNotesCount={setNotesCount}
          />
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}
