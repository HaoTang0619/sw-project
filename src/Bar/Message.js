import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CustomModal from "../components/CustomModal";
import Chatroom from "./Chatroom";
import { CONCAT_SERVER_URL } from "../utils";

const useStyles = makeStyles((theme) => ({
  room: {
    outline: "none",
  },
  rounded: {
    width: "32px",
    borderRadius: "16px",
    marginRight: "10px",
  },
  accordion: {
    margin: 0,
    borderBottom: "1px solid #aaa",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "44.44%",
    flexShrink: 0,
    fontWeight: 800,
    overflow: "hidden",
  },
  secondaryHeading: {
    paddingLeft: "50px",
    margin: "auto",
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    overflow: "hidden",
  },
  jumpFrame: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    maxWidth: "800px",
    [`@media (max-width: 800px)`]: {
      maxWidth: "600px",
    },
  },
  none: {
    pointerEvents: "none",
  },
}));

export default function Message(props) {
  const classes = useStyles();
  const { type, allText, time } = props;

  const [chatInfo, setChatInfo] = useState({
    isOpen: false,
    roomId: 0,
    id: 0,
    avatar_url: "",
    name: "",
  });

  // Toggle function (for chat)
  const handleSetChatInfo = (roomId, id, avatarUrl, name) => (event) => {
    if (event.type === "keydown" && event.key !== "Enter") return;
    if (type === "chats") {
      setChatInfo({
        isOpen: true,
        roomId,
        id,
        avatar_url: avatarUrl,
        name,
      });
    }
  };

  const onHide = () => {
    setChatInfo((state) => ({
      ...state,
      isOpen: false,
      roomId: 0,
    }));
  };

  return (
    <div>
      {allText.map((text) =>
        text.map((page) =>
          page.message.map((value) => {
            const background =
              time === null || time < value.created_at ? "#fff8e5" : "white";

            return (
              <div
                key={time + value.id}
                className={classes.room}
                onClick={handleSetChatInfo(
                  value.room_id,
                  value.user_id2,
                  value.avatar_url,
                  value.username
                )}
                onKeyDown={handleSetChatInfo(
                  value.room_id,
                  value.user_id2,
                  value.avatar_url,
                  value.username
                )}
                tabIndex={0}
                role="button"
              >
                <Accordion
                  defaultExpanded={background === "#fff8e5" || type === "chats"}
                  className={clsx(classes.accordion, {
                    [classes.none]: type === "chats",
                  })}
                  style={{
                    borderRadius: 0,
                    background,
                  }}
                >
                  <AccordionSummary
                    expandIcon={type !== "chats" && <ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      {type === "chats" && (
                        <>
                          <img
                            alt="Avatar"
                            className={classes.rounded}
                            src={CONCAT_SERVER_URL(value.header.avatar_url)}
                          />
                          {value.header.username}
                        </>
                      )}
                      {type !== "chats" && value.header}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      {value.secondary}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ cursor: "auto" }}>
                    <div dangerouslySetInnerHTML={{ __html: value.content }} />
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })
        )
      )}
      {type === "chats" && (
        <CustomModal
          show={chatInfo.isOpen}
          onHide={onHide}
          jumpFrame={classes.jumpFrame}
          backdrop
        >
          <Chatroom
            chatInfo={chatInfo}
            setChatInfo={setChatInfo}
            onHide={onHide}
          />
        </CustomModal>
      )}
    </div>
  );
}
