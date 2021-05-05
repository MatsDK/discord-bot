import mongoose from "mongoose";

export default () => {
  mongoose.connect("mongodb://localhost:27017/Bots", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => console.log("connected to database"));
};
