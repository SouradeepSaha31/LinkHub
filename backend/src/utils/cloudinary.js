import {v2 as cloudinary} from "cloudinary"
import fs from "fs"



const fileUploadOnCloudinary = async (localpath, folder, name) => {
    
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }) 
    
    try {
        let uploadURL = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto",
            public_id: name,
            folder: folder
        })
        const optimisedURL = cloudinary.url("file", {
            fetch_format: 'auto',
            quality: 'auto',
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        })

        // fs.unlinkSync(localpath)

        return uploadURL

    } catch (error) {
        console.log(error)
        fs.unlinkSync(localpath)
    }
}





export {fileUploadOnCloudinary}