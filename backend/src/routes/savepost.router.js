import {Router} from "express"
const savepostRouter = Router()
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"

import {savepost, showSavePost, showLoggedinUserSavePost, unsavePost} from "../controllers/savepost.controller.js"





savepostRouter.route("/postsave/:postId").post(isLoggedIn, savepost)
savepostRouter.route("/showpostsave").get(isLoggedIn, showSavePost)
savepostRouter.route("/showloggedinuserpostsave").get(isLoggedIn, showLoggedinUserSavePost)
savepostRouter.route("/unsavepost/:postId").post(isLoggedIn, unsavePost)





export {savepostRouter}