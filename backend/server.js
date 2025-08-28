import dotenv from "dotenv";
import express from "express";
import { dbConnect } from "./config/db.js";
import userRoutes from './routes/user.routes.js'
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4011;
dbConnect();

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Welcome to the Store");
});

app.use("/api/auth",userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port : ${PORT}`);
});
