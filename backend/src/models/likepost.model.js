import mongoose from "mongoose";

const likepostSchema = mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
},{timestamps: true})

const likepostModel = mongoose.model("likepost", likepostSchema)

export {likepostModel}