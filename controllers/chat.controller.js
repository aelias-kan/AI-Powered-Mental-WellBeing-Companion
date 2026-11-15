const Chat = require("../models/Chat.model");

exports.saveChat = async function (req, res) {
  try {
    if (req.session.selected_chat_id) {
      const chat = await Chat.findById(req.session.selected_chat_id);
      chat.chat_data.push({
        user: res.locals.user,
        message: res.locals.message,
      });
      chat.save();
    } else {
      const chat = await Chat.create({
        title: req.body.prompt,
        user_id: req.user._id,
      });
      chat.chat_data.push({
        user: res.locals.user,
        message: res.locals.message,
      });
      chat.save();

      req.session.selected_chat_id = chat._id;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save the chat!" });
  }
};

exports.getChat = async function (req, res, next) {
  try {
    const chat = await Chat.findById(req.params.id);
    res.locals.chat_data = chat.chat_data;
    req.session.selected_chat_id = chat._id;
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

exports.getLastChats = async function (req, res, next) {
  try {
    const chat = await Chat.findById(req.session.selected_chat_id);

    if (chat && chat.chat_data) {
      // Get the last messages from the chat_data array
      const lastChats = chat.chat_data.slice(-20).map((message) => {
        // Convert "You" to "user" and "Mental Wellbeing Companion" to "system"
        return {
          role:
            message.user === "You"
              ? "user"
              : message.user === "Mental Wellbeing Companion"
              ? "system"
              : message.user,
          content: message.message,
        };
      });

      res.locals.last_chats = lastChats; // Store in res.locals for access in the next middleware or view
    }

    console.log(res.locals.last_chats);
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};
exports.getAllChatsTitles = async function (req, res, next) {
  try {
    const allChats = await Chat.find({ user_id: req.user._id });

    res.locals.chats_data = allChats.map((item) => {
      return {
        chat_id: item._id,
        title: item.title,
      };
    });

    next();
  } catch (error) {
    console.error(error);
    next();
  }
};

exports.deleteChat = async function (req, res, next) {
  try {
    const chat = await Chat.findByIdAndDelete(req.body.chat_id);
    next();
  } catch (error) {
    console.error(error);
    next();
  }
};
