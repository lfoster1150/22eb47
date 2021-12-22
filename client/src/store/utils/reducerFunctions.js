export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.isLatestMessageSeen = false;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;

      const user1LastActiveDate = convoCopy.user1LastActive;
      const user2LastActiveDate = convoCopy.user2LastActive;
      let messageCreatedAt = new Date(message.createdAt)
      messageCreatedAt = messageCreatedAt.getTime();
      const messageSenderId = message.senderId;

      if (messageSenderId === convoCopy.user1Id) {
        user2LastActiveDate && (user2LastActiveDate < messageCreatedAt) ? 
        convoCopy.isLatestMessageSeen = false :
        convoCopy.isLatestMessageSeen = true
      } else {
        user1LastActiveDate && (user1LastActiveDate < messageCreatedAt) ? 
        convoCopy.isLatestMessageSeen = false :
        convoCopy.isLatestMessageSeen = true
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.user1LastActive = null;
      convoCopy.user2LastActive = Date.now().getTime();
      convoCopy.user1Id = message.senderId;
      convoCopy.user2Id = convo.otherUser.id;
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;
      convoCopy.isLatestMessageSeen = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateConvoStatusInStore = (state, data) => {
  return state.map((convo) => {
    if (convo.id === data.id) {
      const convoCopy = { ...convo };
      convoCopy.user1LastActive = data.user1LastActive;
      convoCopy.user2LastActive = data.user2LastActive;
      const user1LastActiveDate = convoCopy.user1LastActive;
      const user2LastActiveDate = convoCopy.user2LastActive;

      const messageCreatedAt = new Date(convoCopy.messages[convoCopy.messages.length - 1].createdAt).getTime();
      const messageSenderId = convoCopy.messages[convoCopy.messages.length - 1].senderId;

      if (messageSenderId === convoCopy.user1Id) {
        user2LastActiveDate && (user2LastActiveDate < messageCreatedAt) ? 
        convoCopy.isLatestMessageSeen = false :
        convoCopy.isLatestMessageSeen = true
      } else {
        user1LastActiveDate && (user1LastActiveDate < messageCreatedAt) ? 
        convoCopy.isLatestMessageSeen = false :
        convoCopy.isLatestMessageSeen = true
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};