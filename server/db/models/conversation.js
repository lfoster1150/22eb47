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
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
