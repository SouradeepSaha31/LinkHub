import {Router} from "express"
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js"
import multer from "multer"
import { 
    signup, 
    logout, 
    login, 
    uploadAvatar, 
    uploadCoverImage, 
    updateDetailesOfProfilePage, 
        } from "../controllers/user.controller.js"

const upload = multer({
    storage: multer.memoryStorage()
})

const userRouter = Router()



userRouter.route("/signup").post(signup)
userRouter.route("/logout").post(isLoggedIn, logout)
userRouter.route("/login").post(login)
userRouter.route("/uploadavatar").post(isLoggedIn, upload.single("avatar"), uploadAvatar)
userRouter.route("/uploadcoverimage").post(isLoggedIn, upload.single("cover"), uploadCoverImage)
userRouter.route("/updateprofiledetailes").post(isLoggedIn, updateDetailesOfProfilePage)


export {userRouter}