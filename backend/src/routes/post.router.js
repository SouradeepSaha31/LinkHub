import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"
import { createPost, showPost} from "../controllers/post.controller.js";


const postRouter = Router()


postRouter.route("/createpost").post(isLoggedIn, upload.single("postfile"), createPost)
postRouter.route("/showpost").get(isLoggedIn, showPost)







export {postRouter}