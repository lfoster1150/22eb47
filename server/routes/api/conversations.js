const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// sorting function
const sortMessages = async (messages) => {
  const sorted =  await messages.sort((a, b) => {
    const aTime = new Date(a.createdAt)
    const bTime = new Date(b.createdAt)
    return aTime - bTime
  })
  return sorted
}

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  console.log(Op)
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // sort messages
      convoJSON.messages = await sortMessages(convoJSON.messages)

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// Update conversation with the last time stamp viewed by each user.
// If null the user is currently in the chat
router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { convoId, isInChat } = req.body;
    const userId = req.user.id;
    const conversation = await Conversation.findOne({
      where: {
        id: convoId
      },
    })
    if (conversation.dataValues.user1Id === userId) {
      const conversationUpdated = await conversation.update({
        user1LastActive: isInChat ? null : Sequelize.literal('CURRENT_TIMESTAMP')
      });
      res.json(conversationUpdated);
    } else if (conversation.dataValues.user2Id === userId) {
      const conversationUpdated = await conversation.update({
        user2LastActive: isInChat ? null : Sequelize.literal('CURRENT_TIMESTAMP')
    });
      res.json(conversationUpdated);
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
