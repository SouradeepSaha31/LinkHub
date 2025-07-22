import mongoose from "mongoose";

const ownerpostSchema = mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
},{timestamps: true})

const ownerpostModel = mongoose.model("ownerpost", ownerpostSchema)

export {ownerpostModel}