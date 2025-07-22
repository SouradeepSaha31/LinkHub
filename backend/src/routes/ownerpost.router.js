import {Router} from "express"
const ownerpostRouter = Router()
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"
import {showPostInProfile, showLoggedinUserPost, showPostInSearchProfile, showSearchUserPost} from "../controllers/ownerpost.controller.js"



ownerpostRouter.route("/showpostinprofile").get(isLoggedIn, showPostInProfile)
ownerpostRouter.route("/showloggedinuserpost").get(isLoggedIn, showLoggedinUserPost)

ownerpostRouter.route("/showpostinsearchprofile/:id").post(isLoggedIn, showPostInSearchProfile)
ownerpostRouter.route("/showsearchuserpost/:id").post(isLoggedIn, showSearchUserPost)






export {ownerpostRouter}