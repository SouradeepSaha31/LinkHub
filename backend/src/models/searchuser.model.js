import mongoose from "mongoose";

const searchUserSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    search:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
}, {timestamps: true})

const searchUserModel = mongoose.model("searchuser", searchUserSchema)

export { searchUserModel }