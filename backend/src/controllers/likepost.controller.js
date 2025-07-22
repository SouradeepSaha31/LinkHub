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


const like = async (req, res) => {
    try {

        let postid = new ObjectId(req.params.postId)
        let userid = new ObjectId(req.user.user_id)

        const findone = await likepostModel.aggregate([
            {
                $match:{
                    postId: postid,
                    userId: userid
                }
            }
        ])

        if (findone.length === 0) {

            await likepostModel.create({
                postId: req.params.postId,
                userId: req.user.user_id
            })
            
        } else {

            await likepostModel.deleteOne({_id: findone[0]._id})
            
        }

        let find = await likepostModel.aggregate([
            {
                $match:{
                    userId: userid 
                }
            },
            {
                $project:{
                  postId: 1
                }
            }
        ])
        let a = find.map((item) => ({postId: item.postId}))
        let b = a.map((item) => (Object.values(item)))
        let c = b.flat(Infinity)

        console.log(c)

        res.status(200).json({likeposts: c})
        
    } catch (error) {
        console.log(error)
    }
}

const likeShowInLikeBox = async (req, res) => {
    try {

        let postId = new ObjectId(req.params.postId)

        const find = await likepostModel.aggregate([
            {
                $match:{
                    postId: postId
                }
            },
            {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userDet"
                }
              },
              {
                $addFields: {
                  userDet: {
                    $arrayElemAt: ["$userDet", 0]
                  }
                }
              }
        ])

        res.status(200).json(find)
        
    } catch (error) {
        console.log("error in likeShowInLikeBox function in likepost controller")
        console.log(error)
    }
}




export {like, likeShowInLikeBox}