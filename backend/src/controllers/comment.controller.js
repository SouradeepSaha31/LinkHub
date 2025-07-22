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

const commentShow = async (req, res) => {
    try {

        let postid = new ObjectId(req.params.postid) 

        let findComment = await commentModel.aggregate([
            {
                $match:{
                    postId: postid
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDet"
                }
            },
            {
                $addFields:{
                    userDet:{
                        $arrayElemAt: ["$userDet", 0]
                    }
                }
            },
            {
                $lookup:{
                    from: "likecomments",
                    localField: "_id",
                    foreignField: "commentId",
                    as: "likeCommentDet"
                }
            },
            {
                $addFields:{
                    likeCommentCount: {
                        $size: "$likeCommentDet"
                      }
                }
            }
        ])

        let findOwner = await ownerpostModel.aggregate([
            {
                $match:{
                    postId: postid
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "ownerDet"
                }
            },
            {
                $addFields:{
                    ownerDet:{
                        $arrayElemAt: ["$ownerDet", 0]
                    }
                }
            },
            {
                $lookup:{
                    from: "posts",
                    localField: "postId",
                    foreignField: "_id",
                    as: "postDet"
                }
            },
            {
                $addFields:{
                    postDet:{
                        $arrayElemAt: ["$postDet", 0]
                    }
                }
            },
            {
                $lookup:{
                    from: "likeposts",
                    localField: "postId",
                    foreignField: "postId",
                    as: "likeDet"
                }
            },
            {
                $addFields:{
                    likeCount:{
                        $size: "$likeDet"
                    }
                }
            },
            {
                $lookup:{
                    from: "comments",
                    localField: "postId",
                    foreignField: "postId",
                    as: "commentDet"
                }
            },
            {
                $addFields:{
                    commentCount: {
                        $size: "$commentDet"
                    }
                }
            }
            
        ])

        res.status(200).json({findComment, findOwner: findOwner[0]})
        
    } catch (error) {
        console.log("error in commentShow function in comment controller")
        console.log(error)
    }
}

const doComment = async (req, res) => {
    try {

        console.log(req.body.singleComment)
        let postid = new ObjectId(req.params.postid)
        let userid = new ObjectId(req.user.user_id)

        if (req.body.singleComment.trim() === "") {
            res.status(200).json("not ok")
        } else {
            let find = await commentModel.aggregate([
                {
                    $match:{
                        postId: postid,
                        userId: userid,
                        comment: req.body.singleComment
                    }
                }
            ])
            
            if (find.length === 0) {
                await commentModel.create({
                    postId: req.params.postid,
                    userId: req.user.user_id,
                    comment: req.body.singleComment.trim()
                })
                res.status(200).json("ok")
            } else {
                res.status(200).json("not ok")
            }
        }

    } catch (error) {
        console.log("error in doComment function in comment controller")
        console.log(error)
    }
}


export {commentShow, doComment}