import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    comment:{
        type: String
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }
},{timestamps: true})

const commentModel = mongoose.model("comment", commentSchema)

export {commentModel}