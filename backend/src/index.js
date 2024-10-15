import express from "express";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import url, {fileURLToPath} from "url";
import Chat from "./models/chats.models.js";
import UserChats from "./models/userChats.model.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 4000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    (`Connected to mongodb!`);
  } catch (error) {
    (error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.URLENDPOINT,
  publicKey: process.env.PUBLICKEY,
  privateKey: process.env.PRIVATEKEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChats = await newChat.save();

    const userChats = await UserChats.find({ userId: userId });

    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChats._id,
            title: text.substring(0, 40),
          },
        ],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChats._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    res.status(201).send(newChat._id);
  } catch (error) {
    (error.message);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId: userId });
    res.status(200).send(userChats[0].chats);
  } catch (error) {
    (error);
    res.status(500).send("Error fetching user chats!");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (error) {
    (error);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, image } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(image && { image }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(201).send(updatedChat);
  } catch (error) {
    (error);
    res.status(500).send("Error adding conversation!");
  }
});

app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.id;

  try {
    await Chat.findByIdAndDelete(chatId);
    await UserChats.updateOne(
      { userId: userId },
      { $pull: { chats: { _id: chatId } } }
    );
    res.send(`Chat with ID ${chatId} deleted successfully!`);
  } catch (error) {
    ("Error deleting chat:", error);
    res.status(401).send("Unauthenticated!");
  }
});

app.use(express.static(path.join(__dirname, "../client")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"))
})

app.listen(port, () => {
  connect();
  (`Server running on port ${port}`);
});
