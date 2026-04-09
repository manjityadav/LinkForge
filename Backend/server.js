import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import postRoutes from "./routes/post.routes.js"
import userRoutes from './routes/user.routes.js'
import path from "path"
dotenv.config();

const app=express();

app.use(cors());

app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);

app.use('/uploads', express.static(path.join(process.cwd(),'uploads')));

const start=async()=>{


    const DB= await mongoose.connect(process.env.url);
    console.log("MongoDB Connected");
    app.listen(9090,()=>{
        console.log("server is running on port 9090")
    })

}

start();