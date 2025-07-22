import {Router} from "express"
const likepostRouter = Router()
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"
import {like, likeShowInLikeBox} from "../controllers/likepost.controller.js"


likepostRouter.route("/like/:postId").post(isLoggedIn, like)
likepostRouter.route("/likeshowinlikebox/:postId").post(isLoggedIn, likeShowInLikeBox)





export {likepostRouter}