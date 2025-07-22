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
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"
import {fileUploadOnCloudinary} from "../utils/cloudinary.js"
import {ObjectId} from "mongodb"


const searchUser = async (req, res) => {
    try {

        let searchuserId = req.body.userId.trim()
        let loggedinuser_id = await userModel.findOne({_id: req.user.user_id})
        let loggedinuserId = loggedinuser_id.userId
        
        if (searchuserId === loggedinuserId) {
            res.status(200).json("the loggedin user put his own userId")
        } else {
            let searchedUser = await userModel.aggregate([
                {
                    $match:{
                        userId: searchuserId
                    }
                }
            ])
            
            if (searchedUser.length === 0) {
                res.status(200).json("no user found")
            } else {
                let newLoggedinUser_id = new ObjectId(loggedinuser_id._id)
                let newSearchedUser_id = new ObjectId(searchedUser[0]._id)
                let isAlreadySearch = await searchUserModel.aggregate([
                    {
                        $match:{
                            userId: newLoggedinUser_id,
                            search: newSearchedUser_id
                        }
                    }
                ]) 

                if (isAlreadySearch.length === 0) {
                    await searchUserModel.create({
                        userId: loggedinuser_id._id,
                        search: searchedUser[0]._id
                    })
                    res.status(200).json("ok")
                } else {
                    res.status(200).json("Already there")
                }
                
            }

        }

        
    } catch (error) {
        console.log("error in searchUser function in user controller")
        console.log(error)
    }
}

const showSearchUser = async (req, res) => {
    try {

        let loggedInUserid = new ObjectId(req.user.user_id)

        let searchedUser = await searchUserModel.aggregate([
            {
                $match:{
                    userId: loggedInUserid
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "search",
                    foreignField: "_id",
                    as: "searchedUserDet"
                }
            },
            {
                $addFields: {
                    searchedUserDet:{
                        $arrayElemAt: ["$searchedUserDet", 0]
                    }
                }
            },
            {
                $project:{
                    searchedUserDet: 1
                }
            }
        ])
        console.log(searchedUser)
        res.status(200).json(searchedUser)
        
    } catch (error) {
        console.log("error in showSearchUser function in searchuser controller")
    }
}

const deleteSearch = async (req, res) => {
    try {

        let id = req.params.id
        
        await searchUserModel.findOneAndDelete({_id: id})

        res.status(200).json("ok")
        
    } catch (error) {
        console.log("error in deleteSearch function in searchuser controller")
        console.log(error)
    }
}

const showSearchProfile = async (req, res) => {
    try {
        let user = await userModel.findOne({_id: req.params.id})
        res.status(200).json(user)
    } catch (error) {
        console.log("error in showSearchProfile function in search user controller")
        console.log(error)
    }
}



export { searchUser, showSearchUser, deleteSearch, showSearchProfile }