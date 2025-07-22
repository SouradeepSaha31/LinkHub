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




const signup = async (req, res) => {
    try {
        const {fullname, userId, email, password} = req.body
    
        if (!fullname) return res.status(404).json(new ApiError(404, "Fullname is Required"))
        if (!userId) return res.status(404).json(new ApiError(404, "User Id is Required"))
        if (!email) return res.status(404).json(new ApiError(404, "Email is Required"))
        if (!password) return res.status(404).json(new ApiError(404, "Password is Required"))

        const newfullname = fullname.trim()

        const newuserId = userId.trim().replace(" ", "_")

        if (newuserId.length < 6) return res.status(404).json(new ApiError(404, "User Id must have minimum 6 charecters"))

        const users = await userModel.findOne({userId: newuserId})

        if (users) return res.status(401).json(new ApiError(401, "Please put a Unique User Id"))

        let trimemail = email.trim()

        if (password.length < 4) return res.status(404).json(new ApiError(404, "Password must have minimum 6 charecters"))

        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const newUser = await userModel.create({
                    fullname: newfullname,
                    userId: newuserId,
                    email: trimemail,
                    password: hash
                })
                let token = jwt.sign({user_id: newUser._id, email: newUser.email}, process.env.TOKEN_SECRET_CODE)
                res.cookie("token", token),
                newUser.refreshToken = token
                newUser.save()
                let user = await userModel.findOne({_id: newUser._id})

                res.status(201).json({user, saveposts: [], likeposts: [], following: [], likecomments: []})
            })
        })

    } catch (error) {
        res.status(500).json(new ApiError(500, "Error, in user/signup", error))
        console.log(error)
    }
    
}

const logout = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.user.user_id})
        res.cookie("token", "")
        user.refreshToken = ""
        await user.save()
        let newUser = await userModel.findOne({_id: req.user.user_id})

        res.status(202).json({token: newUser.refreshToken})
    } catch (error) {
        res.status(500).json(new ApiError(500, "error in logout route"))
    }
}

const login = async (req, res) => {
    try {
        const {userId, password} = req.body
        
        const user = await userModel.findOne({userId})
    
        if(!user) return res.status(404).json(new ApiError(404, "User not Found !!"))
        
        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {
                let token = jwt.sign({user_id: user._id, email: user.email}, process.env.TOKEN_SECRET_CODE)
                res.cookie("token", token),
                user.refreshToken = token
                await user.save()
                const normaluser = await userModel.findOne({_id: user._id})

                let userid = new ObjectId(normaluser._id)

                let find1 = await savepostModel.aggregate([
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

                if (find1.length === 0) {

                    let find2 = await likepostModel.aggregate([
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
                    if (find2.length === 0) {

                        let find3 = await followModel.aggregate([
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

                        if (find3.length === 0) {

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts: [], likeposts: [], following: [], likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts: [], likeposts: [], following: [], likecomments})
                            }

                        } else {
                            let a = find3.map((item) => ({follow: item.follow}))
                            let b = a.map((item) => (Object.values(item)))
                            let following = b.flat(Infinity)

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts: [], likeposts: [], following, likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts: [], likeposts: [], following, likecomments})
                            }
                        }

                    } else {
                        let a = find2.map((item) => ({postId: item.postId}))
                        let b = a.map((item) => (Object.values(item)))
                        let likeposts = b.flat(Infinity)

                        let find3 = await followModel.aggregate([
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

                        if (find3.length === 0) {

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts: [], likeposts, following: [], likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts: [], likeposts, following: [], likecomments})
                            }

                        } else {
                            let a = find3.map((item) => ({follow: item.follow}))
                            let b = a.map((item) => (Object.values(item)))
                            let following = b.flat(Infinity)

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts: [], likeposts, following, likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts: [], likeposts, following, likecomments})
                            }
                        }
                    }

                } else {
                    let a = find1.map((item) => ({postId: item.postId}))
                    let b = a.map((item) => (Object.values(item)))
                    let saveposts = b.flat(Infinity)

                    let find2 = await likepostModel.aggregate([
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
                    if (find2.length === 0) {

                        let find3 = await followModel.aggregate([
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

                        if (find3.length === 0) {

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts, likeposts: [], following: [], likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts, likeposts: [], following: [], likecomments})
                            }

                        } else {
                            let a = find3.map((item) => ({follow: item.follow}))
                            let b = a.map((item) => (Object.values(item)))
                            let following = b.flat(Infinity)

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts, likeposts: [], following, likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts, likeposts: [], following, likecomments})
                            }
                        }

                    } else {
                        let a = find2.map((item) => ({postId: item.postId}))
                        let b = a.map((item) => (Object.values(item)))
                        let likeposts = b.flat(Infinity)

                        let find3 = await followModel.aggregate([
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

                        if (find3.length === 0) {

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts, likeposts, following: [], likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts, likeposts, following: [], likecomments})
                            }

                        } else {
                            let a = find3.map((item) => ({follow: item.follow}))
                            let b = a.map((item) => (Object.values(item)))
                            let following = b.flat(Infinity)

                            let find4 = await likeCommentModel.aggregate([
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
                            if (find4.length === 0) {
                                res.status(201).json({user: normaluser, saveposts, likeposts, following, likecomments: []})
                            } else {
                                let a = find4.map((item) => ({commentId: item.commentId}))
                                let b = a.map((item) => (Object.values(item)))
                                let likecomments = b.flat(Infinity)

                                res.status(201).json({user: normaluser, saveposts, likeposts, following, likecomments})
                            }
                        }
                    }
                }
                
            } else {
                return res.status(404).json(new ApiError(404, "Password is not Matched !!"))
            }
        })

    } catch (error) {
        res.status(500).json(new ApiError(500, "Error, in user/login", error))
        console.log(error)
    }
}

const uploadAvatar = async (req, res) => {
    try {

        if(!req.file) return res.status(404).json(new ApiError(404, "Error while file uploading"))

        let user = await userModel.findOne({_id: req.user.user_id})

        if(req.file.size > 1024*1024*10) return res.status(404).json(new ApiError(404, "File size is too much"))

        let filename = "avatar" + "--" + user._id

        const avatar = await fileUploadOnCloudinary(req.file.path, "Avatar_and_Coverimage", filename)

        fs.unlinkSync(req.file.path)

        await userModel.findOneAndUpdate({_id: req.user.user_id}, {avatar: avatar.secure_url})

        let normaluser = await userModel.findOne({_id: req.user.user_id})

        res.status(201).json({user: normaluser})

    } catch (error) {
        console.log("error in uploadAvatar : ", error)
        res.status(500).json(new ApiError(500, "error in uploadAvatar", error))
    }
}

const uploadCoverImage = async (req, res) => {
    try {
        if(!req.file) return res.status(404).json(new ApiError(404, "Error while file uploading"))

        let user = await userModel.findOne({_id: req.user.user_id})

        if(req.file.size > 1024*1024*10) return res.status(404).json(new ApiError(404, "File size is too much"))

        let filename = "coverimage" + "--" + user._id

        const cover = await fileUploadOnCloudinary(req.file.path, "Avatar_and_Coverimage", filename)

        fs.unlinkSync(req.file.path)

        await userModel.findOneAndUpdate({_id: req.user.user_id}, {coverImage: cover.secure_url})

        let normaluser = await userModel.findOne({_id: req.user.user_id})

        res.status(201).json({user: normaluser})


    } catch (error) {
        res.status(500).json(new ApiError(500, "error in uploadAvatar", error))
    }
}

const updateDetailesOfProfilePage = async (req, res) => {
    try {
        const {fullname, bio, userid, email, currpassword, newpassword, conpassword} = req.body
        console.log(req.body)
    
        const user = await userModel.findOne({_id: req.user.user_id})
        const alluser = await userModel.find()
    
        if(fullname){
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {fullname: fullname.trim()})
        } else {
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {fullname: user.fullname})
        }
    
        if(bio){
            console.log(bio.trim())
            let trimbio = bio.trim()
            let biolength = trimbio.split(" ").join("").length
            if(biolength < 101) {
                await userModel.findOneAndUpdate({_id: req.user.user_id}, {bio: trimbio})
    
            } else {
                return res.status(404).json(new ApiError(404, "bio have maximum 100 charecters"))
            }
        } else {
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {bio: user.bio})
        }
    
        if(email){
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {email: email.trim()})
        } else {
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {email: user.email})
        }
    
        if (userid) {
            console.log("ok")
            let trimuserid = userid.trim().replace(" ", "_")
            console.log(trimuserid)
            if (trimuserid.length >= 6) {
    
                const isuserfound = await userModel.findOne({userId: trimuserid})
                if (isuserfound) {
    
                    if (trimuserid === user.userId) {
                        await userModel.findOneAndUpdate({_id: req.user.user_id}, {userId: trimuserid})
                    } else {
                        return res.status(404).json(new ApiError(404, "User Id must be unique")) 
                    }
                } else {
                    await userModel.findOneAndUpdate({_id: req.user.user_id}, {userId: trimuserid})
                }
                
            } else {
                return res.status(404).json(new ApiError(404, "User Id must have minimum 6 charecters")) 
            }
                    
        } else {
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {userId: user.userId})
        }
    
        if (currpassword) {
            const ismatch = await bcrypt.compare(currpassword, user.password)
                if (ismatch) {
                    console.log(ismatch)
                    if (newpassword) {
                        console.log(newpassword)
                        if (newpassword.length >= 4) {
                            if (conpassword) {
                                if (newpassword === conpassword) {
                                        const salt = await bcrypt.genSalt(10);
                                        const hash = await bcrypt.hash(newpassword, salt);
                                        await userModel.findOneAndUpdate({_id: req.user.user_id}, {password: hash})
                                } else {
                                    return res.status(404).json(new ApiError(404, "Your new password & confirm password are not matched"))
                                }
                            } else {
                                return res.status(404).json(new ApiError(404, "Please put your Confirm Password"))
                            }
                        } else {
                            return res.status(404).json(new ApiError(404, "New password must have minimum 4 charecters"))
                        }
                    } else {
                        return res.status(404).json(new ApiError(404, "Please put your new password"))
                    }
                } else {
                    console.log(ismatch)
                    return res.status(404).json(new ApiError(404, "Current password is not matched !!")) 
                }
        } else {
            await userModel.findOneAndUpdate({_id: req.user.user_id}, {password: user.password})
        }

        let normaluser = await userModel.findOne({_id: req.user.user_id})

        res.status(201).json({user: normaluser})

    
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
}





export {signup, logout, login, uploadAvatar, uploadCoverImage, updateDetailesOfProfilePage}