if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const initializePassport = require("./userAuth/authLogin");
const OpenAI = require("openai");

// OpenAI API
if (!process.env.OPENAI_API_KEY) {
    throw new Error(
        "OpenAI API key is missing. Please check your environment variables."
    );
}
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

initializePassport(passport);

const app = express();

//Controllers
const chatController = require("./controllers/chat.controller");

// Import routes
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const indexRouter = require("./routes/index");

// View engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Static files
app.use("/public", express.static("public"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Routes
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/", indexRouter);

// Import controllers
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");

// Authentication routes
app.post(
    "/authLogin",
    require("./middlewares/auth").checkNotAuthenticated,
    authController.login
);
app.post(
    "/authSignup",
    require("./middlewares/auth").checkNotAuthenticated,
    authController.signup
);
app.delete("/logout", authController.logout);

// User routes
app.get(
    "/",
    require("./middlewares/auth").checkAuthenticated,
    chatController.getAllChatsTitles,
    (req, res, next) => {
        delete req.session["selected_chat_id"];
        next();
    },
    userController.getUserProfile
);

app.post(
    "/generate-advice",
    chatController.getLastChats,
    userController.getUserInfo,
    async(req, res) => {
        try {
            const { prompt } = req.body;

            //Save User Chat
            res.locals.user = "You";
            res.locals.message = prompt;
            chatController.saveChat(req, res);

            let userData = res.locals.userInfo;
            let userInfo = {
                role: "user",
                content: `
          My name: ${userData.name}
          My age: ${userData.age}
          Gender: ${userData.sex}
          Brief Description: ${userData.user_brief}
          `,
            };

            let lastChats = res.locals.last_chats;
            let context = {};
            if (lastChats != undefined) {
                context = [...lastChats, { role: "user", content: prompt }];
            } else {
                context = [{ role: "user", content: prompt }];
            }

            const completion = await openai.chat.completions.create({
                messages: [{
                        role: "system",
                        content: "You are an AI assistant specializing in mental health support. Respond only to mental health-related questions. Provide concise, empathetic answers to support users on mental health issues. If a user mentions abuse (physical or verbal), respond compassionately and recommend they contact a licensed professional or support service. For users expressing severe distress, gently advise seeking immediate help from a therapist or counselor. If asked about anything not related to mental health, clearly state: 'I am here to assist with mental health concerns only, and I recommend seeking specialized help for your question.' Do not elaborate on out-of-scope topics.",
                    },
                    userInfo,
                    ...context,
                ],
                model: "ft:gpt-4o-mini-2024-07-18:personal:fyp-fine-tuning-v4:A074n8sv:ckpt-step-406",
            });

            //Save Companion Chat
            res.locals.user = "Mental Wellbeing Companion";
            res.locals.message = completion.choices[0].message.content;
            chatController.saveChat(req, res);

            res.status(200).json({
                success: true,
                data: completion.choices[0].message.content,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "There was an issue processing the request.",
            });
        }
    }
);

app.get(
    "/chats/:id",
    require("./middlewares/auth").checkAuthenticated,
    chatController.getAllChatsTitles,
    chatController.getChat,
    userController.getUserProfile
);

// app.get("/last-chats", );

app.delete(
    "/chats/",
    require("./middlewares/auth").checkAuthenticated,
    chatController.deleteChat,
    (req, res, next) => {
        res.redirect("/");
    }
);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});