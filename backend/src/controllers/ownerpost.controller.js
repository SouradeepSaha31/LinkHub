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

const showPostInProfile = async (req, res) => {
    try {

        const userId = new ObjectId(req.user.user_id) 

        let findpost = await ownerpostModel.aggregate([
            {
                $match:{
                    userId: userId
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
                $addFields: {
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
                    likeCount: {
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

        console.log(findpost)

        res.status(200).json(findpost)
        
    } catch (error) {
        console.log(error)
    }
}

const showLoggedinUserPost = async (req, res) => {
    try {

        const userId = new ObjectId(req.user.user_id) 

        let findpost = await ownerpostModel.aggregate([
            {
                $match:{
                    userId: userId
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
                $addFields: {
                  postDet:{
                    $arrayElemAt: ["$postDet", 0]
                  }
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
                $addFields: {
                    userDet:{
                    $arrayElemAt: ["$userDet", 0]
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
                $addFields: {
                    likeCount:{
                    $size: "$likeDet"
                  }
                }
            }
        ])

        console.log(findpost)

        res.status(201).send(findpost);

    } catch (error) {
        console.log(error)
        res.status(500).json(new ApiError(500, "error in showPost controller"))
    }
}


const showPostInSearchProfile = async (req, res) => {
    try {

        const userId = new ObjectId(req.params.id) 

        let findpost = await ownerpostModel.aggregate([
            {
                $match:{
                    userId: userId
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
                $addFields: {
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
                    likeCount: {
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

        console.log(findpost)

        res.status(200).json(findpost)
        
    } catch (error) {
        console.log("error in showPostInSearchProfile function in ownerpost controller")
        console.log(error)
    }
}

const showSearchUserPost = async (req, res) => {
    try {

        const userId = new ObjectId(req.params.id) 

        let findpost = await ownerpostModel.aggregate([
            {
                $match:{
                    userId: userId
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
                $addFields: {
                  postDet:{
                    $arrayElemAt: ["$postDet", 0]
                  }
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
                $addFields: {
                    userDet:{
                    $arrayElemAt: ["$userDet", 0]
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
                $addFields: {
                    likeCount:{
                    $size: "$likeDet"
                  }
                }
            }
        ])

        console.log(findpost)

        res.status(201).send(findpost);

    } catch (error) {
        console.log(error)
        res.status(500).json(new ApiError(500, "error in showPost controller"))
    }
}





export {showPostInProfile, showLoggedinUserPost, showPostInSearchProfile, showSearchUserPost}