import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, isLatestMessageSeen } = props;

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        const length = messages.length;
        return message.senderId === userId ? (
            <SenderBubble 
              key={message.id} 
              text={message.text} 
              time={time} 
              isLatestMessageSeen={index === length - 1 && isLatestMessageSeen} 
              otherUser={otherUser} 
            />
        ) : (
            <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
