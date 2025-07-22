import { Timestamp } from "mongodb"
import mongoose from "mongoose"

const likeCommentSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    commentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }
}, {timestamps: true})

const likeCommentModel = mongoose.model("likecomment", likeCommentSchema)

export {likeCommentModel}