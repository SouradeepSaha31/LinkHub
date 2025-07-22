import {userModel} from "../models/user.model.js"
import {postModel} from "../models/post.model.js"
import {savepostModel} from "../models/savepost.model.js"
import {ownerpostModel} from "../models/ownerpost.model.js"
import { likepostModel } from "../models/likepost.model.js"
import {followModel} from "../models/follow.model.js"
import { searchUserModel } from "../models/searchuser.model.js"
import {commentModel} from "../models/comment.model.js"
import {likeCommentModel} from "../models/likecomment.model.js"

import {ApiError} from "../utils/ApiError.js"
import {fileUploadOnCloudinary} from "../utils/cloudinary.js"
import {ObjectId} from "mongodb"


const likeTheComment = async (req, res) => {
    try {

        let commentid = new ObjectId(req.params.commentid)
        let userid = new ObjectId(req.user.user_id)

        let findone = await likeCommentModel.aggregate([
            {
                $match:{
                    commentId: commentid,
                    userId: userid
                }
            }
        ])

        if (findone.length === 0) {
            await likeCommentModel.create({
                commentId: req.params.commentid,
                userId: req.user.user_id
            })
        } else {
            await likeCommentModel.deleteOne({_id: findone[0]._id})
        }

        let find = await likeCommentModel.aggregate([
            {
                $match:{
                    userId: userid 
                }
            },
            {
                $project:{
                    commentId: 1
                }
            }
        ])
        let a = find.map((item) => ({commentId: item.commentId}))
        let b = a.map((item) => (Object.values(item)))
        let c = b.flat(Infinity)

        console.log(c)

        res.status(200).json({likecomments: c})
        
    } catch (error) {
        console.log("error in likeTheComment function in like comment controller")
    }
}



export {likeTheComment}