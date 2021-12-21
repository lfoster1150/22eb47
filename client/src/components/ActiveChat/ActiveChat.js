import React, { useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { updateConversation } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, activeConversation, updateConversation } = props;
  const conversation = props.conversation || {};

  const handleUpdateConversation = useCallback((id, isInChat) => {
    const body = {
      convoId: id,
      isInChat: isInChat
    }
    updateConversation(body)
  }, [updateConversation])

  useEffect(() => {
    if (conversation.id) {
      console.log("mount id: ", conversation.id)
      handleUpdateConversation(conversation.id, true)
    }
  }, [activeConversation, handleUpdateConversation, conversation.id]);
  
  useEffect(() => () => {
    if (conversation.id) {
      console.log("unmount id: ", conversation.id)
      handleUpdateConversation(conversation.id, false)
    }
  }, [activeConversation, handleUpdateConversation, conversation.id]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              isLatestMessageSeen={conversation.isLatestMessageSeen}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    activeConversation: state.activeConversation,
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConversation: (body) => {
      dispatch(updateConversation(body));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null)(ActiveChat);
