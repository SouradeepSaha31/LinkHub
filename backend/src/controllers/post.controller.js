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
import {fileUpload} from "../utils/cloudinary.js"
import fs from "fs"
import {ObjectId} from "mongodb"

import { v4 as uuid } from 'uuid';




const createPost = async (req, res) => {
    try {
        
        const {caption} = req.body
        const trimcap = caption.trim()

        let user = await userModel.findOne({_id: req.user.user_id})

        if(trimcap.split(" ").join("").length > 30) return res.status(404).json(new ApiError(404, "Caption maximum have 30 charecters"))

        if(req.file.size > 1024*1024*10) return res.status(404).json(new ApiError(404, "File size is too much"))

        const file = await fileUpload(req.file, uuid())

        const post = await postModel.create({
            caption: trimcap,
            file: file.url,
            owner: user._id
        })

        let owner = await ownerpostModel.create({
            postId: post._id,
            userId: user._id
        })

        res.status(201).json({user: {post, owner}})

    } catch (error) {
        console.log(error)
        res.status(404).json(new ApiError("404", "error in create post controller"))
    }
}

const showPost = async (req, res) => {
    try {

        let allpost = await postModel.aggregate([
            {
                $lookup:{
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDet"
                }
            },
            {
                $addFields: {
                    ownerDet:{
                    $arrayElemAt: ["$ownerDet", 0]
                  }
                }
            },
            {
                $lookup:{
                    from: "likeposts",
                    localField: "_id",
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
            },
            {
                $lookup:{
                    from: "comments",
                    localField: "_id",
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

        console.log(allpost)

        res.status(201).send(allpost);

    } catch (error) {
        console.log(error)
        res.status(500).json(new ApiError(500, "error in showPost controller"))
    }

    
}









export {createPost, showPost}