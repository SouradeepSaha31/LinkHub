import {Router} from "express"
const followRouter = Router()
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import upload from "../middleware/multer.middleware.js"
import {follow, followShow, followShowInProfile, followersBox, followingsBox, unFollow, removeFollower} from "../controllers/follow.controller.js"


followRouter.route("/followclick/:id").post(isLoggedIn, follow)
followRouter.route("/followshow/:id").post(isLoggedIn, followShow)
followRouter.route("/followshowinprofile").get(isLoggedIn, followShowInProfile)
followRouter.route("/followersbox/:userId").post(isLoggedIn, followersBox)
followRouter.route("/followingsbox/:userId").post(isLoggedIn, followingsBox)
followRouter.route("/unfollow/:userid").post(isLoggedIn, unFollow)
followRouter.route("/removefollower/:userid").post(isLoggedIn, removeFollower)






export {followRouter}