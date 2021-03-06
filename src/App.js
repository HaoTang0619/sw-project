import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import Echo from "laravel-echo";
import io from "socket.io-client";

import Bar from "./Bar/Bar";
import Homepage from "./Homepage/Homepage";
import SignUpPage from "./Login/SignUpPage";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";
import { getCookie } from "./cookieHelper";
import { setData, selectUser } from "./redux/userSlice";

import { REDIS_URL } from "./constants";
import { CONCAT_SERVER_URL } from "./utils";
import AlertDialog from "./components/AlertDialog";
import ErrorMsg from "./components/ErrorMsg";
import Loading from "./components/Loading";
import { closeDialog, selectDialog } from "./redux/dialogSlice";
import PostList from "./PostList/PostList";

export default function App() {
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState({ message: "", url: "" });
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);
  const user = useSelector(selectUser);
  const dialog = useSelector(selectDialog);

  useEffect(() => {
    document.title = "賭ケグルイ";
  }, []);

  // Broadcast
  useEffect(() => {
    window.io = io;
    if (user.apiToken === null) return;
    window.Echo = new Echo({
      broadcaster: "socket.io",
      host: REDIS_URL, // this is the laravel-echo-server host
      auth: {
        headers: {
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
      socketio: { pingTimeout: 30000 },
    });

    window.Echo.join("Online");
    window.Echo.channel("Announcements");
    window.Echo.channel("Notifications");
  }, [user.apiToken]);

  useEffect(() => {
    const accessToken = getCookie();
    setError({ message: "", url: "" });
    if (location.pathname !== "/" || accessToken !== null) {
      setIsReady(false);
      axios
        .post(CONCAT_SERVER_URL("/api/v1/user/authentication"), {
          accessToken,
        })
        .then((res) => {
          if (res.data.isValid === true) {
            stableDispatch(
              setData({
                username: res.data.username,
                user_id: res.data.user_id,
                userAvatar: res.data.avatar_url,
                point: res.data.point,
                bucket_time: res.data.bucket_time,
                api_token: res.data.api_token,
                verified: Boolean(res.data.verified),
              })
            );
            if (location.pathname === "/" && Boolean(res.data.verified))
              history.push("/home");
          } else {
            stableDispatch(
              setData({
                username: null,
                user_id: null,
                userAvatar: null,
                point: null,
                bucket_time: null,
                api_token: null,
                verified: null,
              })
            );
          }
        })
        .catch(() => {
          setError({
            message: "Connection Error",
            url: "/pictures/connection-error.svg",
          });
        })
        .finally(() => setIsReady(true));
    } else if (user.verified !== false) {
      stableDispatch(
        setData({
          username: null,
          user_id: null,
          userAvatar: null,
          point: null,
          bucket_time: null,
          api_token: null,
          verified: null,
        })
      );
    }
  }, [user.verified]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (user.userId !== null) {
        axios
          .post(CONCAT_SERVER_URL("/api/v1/user/count"), {
            id: user.userId,
          })
          .catch(() => {
            setError({
              message: "Connection Error",
              url: "/pictures/connection-error.svg",
            });
          });
      }
    }, 600000);
    return () => {
      clearInterval(timer);
    };
  }, [user.userId]);

  if (isReady || location.pathname === "/") {
    if (error.message !== "") {
      return <ErrorMsg message={error.message} imgUrl={error.url} />;
    }
    return (
      <div>
        {location.pathname !== "/" && <Bar />}
        <Switch>
          <Route exact path="/" component={SignUpPage} />
          <Route exact path="/home" component={Homepage} />
          <Route exact path="/home/:tag" component={Homepage} />
          <Route
            exact
            path="/picture/:pictureId"
            render={(props) => <Content match={props.match} />}
          />
          <Route
            exact
            path="/profile/:name"
            render={(props) => <Profile match={props.match} />}
          />
          <Route exact path="/setting" component={() => <>setting</>} />
          <Route exact path="/logout" component={() => <>logout</>} />
          <Route exact path="/postlist" component={() => <PostList />} />
        </Switch>
        <AlertDialog
          open={dialog.isOpen}
          alertTitle={dialog.title}
          alertDesciption={dialog.message}
          alertButton={
            <>
              <Button
                onClick={() => {
                  dispatch(closeDialog());
                }}
              >
                Got it!
              </Button>
            </>
          }
          onClose={() => {
            dispatch(closeDialog());
          }}
        />
      </div>
    );
  }
  return <Loading />;
}
