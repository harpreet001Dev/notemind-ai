import express from "express";
import cors from "cors";
import "dotenv/config.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import connectDB from "./src/db/connect.js";
import router from "./src/routers/index.js";
import authtenticateUser from "./src/middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

const PORT=process.env.PORT || 5000;

const app=express();
app.use(
    cors({
        origin: "https://notemind-ai-beta.vercel.app",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser())

app.use("/api",router)
app.use(errorHandler);
app.use(authtenticateUser);

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})