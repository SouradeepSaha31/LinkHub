import {Router} from "express"
const commentRouter = Router()
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"
import {commentShow, doComment} from "../controllers/comment.controller.js"


commentRouter.route("/commentshow/:postid").post(isLoggedIn, commentShow)
commentRouter.route("/commentdo/:postid").post(isLoggedIn, doComment)






export {commentRouter}