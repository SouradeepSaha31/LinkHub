import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
// import upload from "../middleware/multer.middleware.js"
import multer from "multer";
import { createPost, showPost} from "../controllers/post.controller.js";

const upload = multer({
    storage: multer.memoryStorage()
})

const postRouter = Router()


postRouter.route("/createpost").post(isLoggedIn, upload.single("postfile"), createPost)
postRouter.route("/showpost").get(isLoggedIn, showPost)







export {postRouter}