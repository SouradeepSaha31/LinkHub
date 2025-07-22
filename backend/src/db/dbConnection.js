import mongoose from "mongoose"

const connectionDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`Mongodb connected sucessfully : ${connection.connection.host}`)
    } catch (error) {
        console.log("Mongodb connection error on dbConnection.js:", error)
        process.exit(1)
    }
}

export {connectionDB}