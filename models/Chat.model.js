const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  chat_data: [
    {
      user: {
        type: String,
      },
      message: {
        type: String,
      },
    },
  ],
  user_id: { type: mongoose.Types.ObjectId },
});
chatSchema.set("timestamps", true);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
