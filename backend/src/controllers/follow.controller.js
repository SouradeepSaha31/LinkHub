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


const follow = async (req, res) => {
    try {

        let loggedinUserId = req.user.user_id
        let followUserId = req.params.id

        let newloggedinUserId = new ObjectId(req.user.user_id)
        let newfollowUserId = new ObjectId(req.params.id)

        let findone = await followModel.aggregate([
            {
                $match:{
                    userId: newloggedinUserId,
                    follow: newfollowUserId
                }
            }
        ])

        if (findone.length === 0) {
            await followModel.create({
                userId: loggedinUserId,
                follow: followUserId
            })

        } else {
            await followModel.deleteOne({_id: findone[0]._id})
        }

        let find = await followModel.aggregate([
            {
                $match:{
                    userId: newloggedinUserId 
                }
            },
            {
                $project:{
                  follow: 1
                }
            }
        ])
        let a = find.map((item) => ({follow: item.follow}))
        let b = a.map((item) => (Object.values(item)))
        let c = b.flat(Infinity)

        console.log(c)

        res.status(200).json({following: c})
        
    } catch (error) {
        console.log("error in follow function in follow controller")
        console.log(error)
    }
}

const followShow = async (req, res) => {
    try {

        let loggedinUserId = req.user.user_id
        let followUserId = req.params.id

        let newloggedinUserId = new ObjectId(req.user.user_id)
        let newfollowUserId = new ObjectId(req.params.id)

        let followers = await followModel.aggregate([
            {
                $match:{
                    follow: newfollowUserId
                }
            }
        ])

        let following = await followModel.aggregate([
            {
                $match:{
                    userId: newfollowUserId
                }
            }
        ])
        
        res.status(200).json({followers: followers.length, following: following.length})
    } catch (error) {
        console.log("error in followShow function in follow controller")
        console.log(error)
    }
}

const followShowInProfile = async (req, res) => {
    try {

        let newloggedinUserId = new ObjectId(req.user.user_id)

        let followers = await followModel.aggregate([
            {
                $match:{
                    follow: newloggedinUserId
                }
            }
        ])

        let following = await followModel.aggregate([
            {
                $match:{
                    userId: newloggedinUserId
                }
            }
        ])
        
        res.status(200).json({followers: followers.length, following: following.length})
    } catch (error) {
        console.log("error in followShow function in follow controller")
        console.log(error)
    }
}

const followersBox = async (req, res) => {
    try {

        let userId = new ObjectId(req.params.userId)

        let find = await followModel.aggregate([
            {
                $match:{
                    follow: userId
                }
            },
            {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "followersDet"
                }
              },
              {
                $addFields: {
                  followersDet: {
                    $first: "$followersDet"
                  }
                }
              }
        ])

        res.status(200).json(find)
        
    } catch (error) {
        console.log("error in followersBox function in follow controller")
        console.log(error)
    }
}

const followingsBox = async (req, res) => {
    try {

        let userId = new ObjectId(req.params.userId)

        let find = await followModel.aggregate([
            {
                $match:{
                    userId: userId
                }
            },
            {
                $lookup: {
                  from: "users",
                  localField: "follow",
                  foreignField: "_id",
                  as: "followingsDet"
                }
              },
              {
                $addFields: {
                  followingsDet: {
                    $first: "$followingsDet"
                  }
                }
              }
        ])

        res.status(200).json(find)
        
    } catch (error) {
        console.log("error in followingsBox function in follow controller")
        console.log(error)
    }
}

const unFollow = async (req, res) => {
    try {

        let unfollow = new ObjectId(req.params.userid)
        let userid = new ObjectId(req.user.user_id)
        
        let findone = await followModel.aggregate([
            {
                $match:{
                    userId: userid,
                    follow: unfollow
                }
            }
        ])

        await followModel.deleteOne({_id: findone[0]._id})
        

        let find = await followModel.aggregate([
            {
                $match:{
                    userId: userid 
                }
            },
            {
                $project:{
                  follow: 1
                }
            }
        ])
        let a = find.map((item) => ({follow: item.follow}))
        let b = a.map((item) => (Object.values(item)))
        let c = b.flat(Infinity)

        console.log(c)

        res.status(200).json({following: c})
        
    } catch (error) {
        console.log("error in unFollow function in follow controller")
        console.log(error)
    }
}

const removeFollower = async (req, res) => {
    try {

        let remove = new ObjectId(req.params.userid)
        let userid = new ObjectId(req.user.user_id)
        
        let findone = await followModel.aggregate([
            {
                $match:{
                    userId: remove,
                    follow: userid
                }
            }
        ])

        await followModel.deleteOne({_id: findone[0]._id})
        

        // let find = await followModel.aggregate([
        //     {
        //         $match:{
        //             userId: userid 
        //         }
        //     },
        //     {
        //         $project:{
        //           follow: 1
        //         }
        //     }
        // ])
        // let a = find.map((item) => ({follow: item.follow}))
        // let b = a.map((item) => (Object.values(item)))
        // let c = b.flat(Infinity)

        // console.log(c)

        res.status(200).json("ok")
        
    } catch (error) {
        console.log("error in unFollow function in follow controller")
        console.log(error)
    }
}




export {follow, followShow, followShowInProfile, followersBox, followingsBox, unFollow, removeFollower}