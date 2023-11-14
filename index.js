const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
mongoose.connect(
  "mongodb+srv://thorykbv:qqRkdDL13ZH5JWcb@cluster0.euoihmw.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Помилка підключення до MongoDB:"));
db.once("open", async () => {
  console.log("Підключено до MongoDB!");
  // await db.createCollection("users");
  // const users = db.collection("users");
  // await users.insertOne({ name: "John", age: 20 });
  // const user = users.findOne({ name: "John" });
  // console.log(user);
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
