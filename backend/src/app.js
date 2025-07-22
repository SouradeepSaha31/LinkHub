import express from "express"
const app = express()
import cookieParser from "cookie-parser"
import cors from "cors"

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "30kb"}))
app.use(express.urlencoded({extended: true, limit: "30kb"}))
app.use(express.static("public"))
app.use(cookieParser())





// import Router

import {userRouter} from "./routes/user.router.js"
import { postRouter } from "./routes/post.router.js"
import { savepostRouter } from "./routes/savepost.router.js"
import { ownerpostRouter } from "./routes/ownerpost.router.js" 
import { likepostRouter } from "./routes/likepost.router.js"
import { followRouter } from "./routes/follow.router.js"
import { searchUserRouter } from "./routes/searchuser.router.js"
import { commentRouter } from "./routes/comment.router.js"
import { likeCommentRouter } from "./routes/likecomment.router.js"




app.use("/api/v1/user", userRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/ownerpost", ownerpostRouter)
app.use("/api/v1/savepost", savepostRouter)
app.use("/api/v1/likepost", likepostRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/searchuser", searchUserRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/likecomment", likeCommentRouter)









export {app}