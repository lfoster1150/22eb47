import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        const length = messages.length;
        return message.senderId === userId ? (
          index === length - 1 ? (
            <SenderBubble key={message.id} text={message.text} time={time} last={true} />
            ) : (
            <SenderBubble key={message.id} text={message.text} time={time} last={false} />
          )
        ) : (
            <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
