import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      let fn = Date.now() + "--" + file.originalname.replace(" ", "-")
        cb(null, fn)
    }
  })
  
  const upload = multer({ storage: storage })

  export default upload