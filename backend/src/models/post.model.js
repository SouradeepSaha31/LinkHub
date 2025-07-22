import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    caption:{
        type: String, 
        required: true,
        maxlength: [50, "caption have maximum 50 charecters"]
    },
    file:{
        type: String,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},{timestamps: true})

const postModel = mongoose.model("post", postSchema)

export {postModel}