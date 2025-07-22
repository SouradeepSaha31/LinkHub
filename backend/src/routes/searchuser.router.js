import {Router} from "express"
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import { searchUser, showSearchUser, deleteSearch, showSearchProfile } from "../controllers/searchuser.controller.js"

const searchUserRouter = Router()


searchUserRouter.route("/usersearch").post(isLoggedIn, searchUser)
searchUserRouter.route("/showsearchuser").get(isLoggedIn, showSearchUser)
searchUserRouter.route("/deletesearch/:id").post(isLoggedIn, deleteSearch)
searchUserRouter.route("/showsearchprofile/:id").post(isLoggedIn, showSearchProfile)







export { searchUserRouter }