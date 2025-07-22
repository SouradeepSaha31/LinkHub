import {Router} from "express"
const likeCommentRouter = Router()
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"
import { likeTheComment } from "../controllers/likecomment.controller.js"

likeCommentRouter.route("/likethecomment/:commentid").post(isLoggedIn, likeTheComment)






export {likeCommentRouter}