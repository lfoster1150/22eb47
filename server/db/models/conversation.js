const { Op, Sequelize } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  user1LastActive: {
    type: Sequelize.BIGINT,
    defaultValue: 1640196717046
  },
  user2LastActive: {
    type: Sequelize.BIGINT,
    defaultValue: 1640196717046
  },
  multiConvoId: {
    type: Sequelize.INTEGER,
    defaultValue: null
  }
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id, multiConvoId = null) {
  let conversation = null;
  if (multiConvoId) {
    conversation = await Conversation.findAll({
      where: {
        user1Id: {
          [Op.or]: [user1Id, user2Id]
        },
        user2Id: {
          [Op.or]: [user1Id, user2Id, null]
        },
        multiConvoId: {
          [Op.is]: [multiConvoId]
        }
      }
    });
  } else {
    conversation = await Conversation.findOne({
      where: {
        user1Id: {
          [Op.or]: [user1Id, user2Id]
        },
        user2Id: {
          [Op.or]: [user1Id, user2Id]
        }
      }
    });
  }
  
  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
