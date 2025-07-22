import jwt from "jsonwebtoken"

const isLoggedIn = (req, res, next) => {
    if (req.cookies.token === "") {
        res.status(404).json({message: "You need to LogIn first"})
    } else {
        let data = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET_CODE)
        req.user = data
        next()
    }
}

export {isLoggedIn}