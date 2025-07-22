import { connectionDB } from "./db/dbConnection.js";
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
import {app} from "./app.js"


connectionDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at port : http://localhost:${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Mongodb connection failed on index.js :", error)
})