import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    fullname:{
        type: String, 
        required: true,
        trim: true
    },
    userId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [6, "userId minimum have 6 charecters"]
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        minlength: [6, "password minimun have 6 charecters"]
    },
    refreshToken: {
        type: String,
    },
    avatar:{
        type: String,
        default: "default-avatar.jpeg"
    },
    coverImage:{
        type: String,
        default: "cover-default.jpg"
    },
    bio:{
        type: String,
        default: "Hey there! I am using Instagram.",
        maxlength: [100, "bio maximum have 100 charecters"]
    },
},{timestamps: true})

const userModel = mongoose.model("user", userSchema)

export {userModel}