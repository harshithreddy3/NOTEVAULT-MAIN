import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from "./routes/user.js"
import noteRouter from "./routes/note.js"
import folderRouter from "./routes/folder.js";

dotenv.config();

await mongoose.connect(process.env.URL).then(() => {
    console.log("Database connection successful ");
})

const app = express();
const port = 3000;
app.use(cors())
app.use(bodyParser.json())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/note", noteRouter)
app.use("/api/v1/folder", folderRouter)

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
})