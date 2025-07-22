import mongoose from "mongoose";

const savepostSchema = mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
},{timestamps: true})

const savepostModel = mongoose.model("savepost", savepostSchema)

export {savepostModel}