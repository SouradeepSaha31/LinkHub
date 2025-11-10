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
// import {fileUploadOnCloudinary} from "../utils/cloudinary.js"
import {ObjectId} from "mongodb"


const savepost = async (req, res) => {

    try {

        console.log(req.params.postId)
        console.log(req.user.user_id)

        let postId = new ObjectId(req.params.postId)
        let userId = new ObjectId(req.user.user_id)

        let findone = await savepostModel.aggregate([
            {
                $match:{
                    postId: postId,
                    userId: userId 
                }
            }
        ])

        console.log(findone)

        if (findone.length === 0) {

            await savepostModel.create({
                postId: req.params.postId,
                userId: req.user.user_id
            })
            
        } else {

            await savepostModel.deleteOne({_id: findone[0]._id})
            
        }

        let find = await savepostModel.aggregate([
            {
                $match:{
                    userId: userId 
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

        res.status(200).json({saveposts: c})

    } catch (error) {
        console.log(error)
    }

}

const showSavePost = async (req, res) => {
    try {

        let userid = new ObjectId(req.user.user_id )

        let saveposts = await savepostModel.aggregate([
            {
                $match:{
                    userId: userid
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

        console.log("savepoststst",saveposts)

        res.status(200).json(saveposts)
        
    } catch (error) {
        console.log(error)
    }
}

const showLoggedinUserSavePost = async (req, res) => {
    try {

        const userId = new ObjectId(req.user.user_id) 

        let findpost = await savepostModel.aggregate([
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
                  postDet: {
                    $arrayElemAt: ["$postDet", 0]
                  }
                }
              },
              {
                $lookup: {
                  from: "users",
                  localField: "postDet.owner",
                  foreignField: "_id",
                  as: "ownerDet"
                }
              },
              {
                $addFields: {
                  ownerDet: {
                    $arrayElemAt: ["$ownerDet", 0]
                  }
                }
              },
              {
                $lookup: {
                  from: "likeposts",
                  localField: "postId",
                  foreignField: "postId",
                  as: "likeDet"
                }
              },
              {
                $addFields: {
                  likeCount: {
                    $size: "$likeDet"
                  }
                }
              },
        ])

        console.log(findpost)

        res.status(201).send(findpost);
        
    } catch (error) {
        console.log(error)
    }
}

const unsavePost = async (req, res) => {
    try {

        let postId = new ObjectId(req.params.postId)
        let userId = new ObjectId(req.user.user_id)

        let findone = await savepostModel.aggregate([
            {
                $match:{
                    postId: postId,
                    userId: userId 
                }
            }
        ])

        await savepostModel.deleteOne({_id: findone[0]._id})

        let find = await savepostModel.aggregate([
            {
                $match:{
                    userId: userId 
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

        res.status(200).json({saveposts: c})



        
    } catch (error) {
        console.log(error)
    }
}


export {savepost, showSavePost, showLoggedinUserSavePost, unsavePost}