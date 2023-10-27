const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@users.nyp2s8t.mongodb.net/post?retryWrites=true&w=majority`,
  collection: "sessions",
});
const path = require("path");

const users = require("./routes/users.js");
const posts = require("./routes/posts.js");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/users", users);
app.use("/posts", posts);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@users.nyp2s8t.mongodb.net/post?retryWrites=true&w=majority`
  )
  .then((result) => {
    const io = require("./socket.js").init(
      app.listen(process.env.PORT || 5000)
    );
    io.on("connect", (socket) => {
      socket.on("disconnect", () => {});
    });
  })
  .catch((err) => console.log(err));
