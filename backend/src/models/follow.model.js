import mongoose from "mongoose";

const followSchema = mongoose.Schema({
    follow:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
},{timestamps: true})

const followModel = mongoose.model("follow", followSchema)

export {followModel}