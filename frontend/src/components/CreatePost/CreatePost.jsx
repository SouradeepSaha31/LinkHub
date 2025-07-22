import React, {useState, useRef} from 'react'
import path from "path-browserify"
import axios from 'axios';
import "./CreatePost.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function CreatePost() {
  // input file click convert and show the file ---------------------------------------------------------
  const clickFile = useRef(null)
  const [image, setimage] = useState("")
  const [check, setcheck] = useState("")

  const handleClick = () => {
    clickFile.current.click()
  }

  const handleChange = (e) => {
    let file = e.target.files[0]
    if (path.extname(file.name) === ".jpeg" || path.extname(file.name) === ".jpg" || path.extname(file.name) === ".png") {
      setcheck("image")
      setimage(file)
    } else if (path.extname(file.name) === ".mkv") {
      setcheck("video")
      setimage(file)
    } else {
      alert("Please select image or video file")
    }
  }
  //------------------------------------------------------------------------------------------------

  //send the caption and file to backend------------------------------------------------------------
  const [caption, setcaption] = useState("")
  console.log(caption)
  console.log(image)

  const navigate = useNavigate()

  const sendFile = async (e) => {
    e.preventDefault()
    if(!image || !caption) {
      return alert("Both fields are required")
    }

    console.log("helo")
    
    try {
      const formdata = new FormData()
        formdata.append("postfile", image)
        formdata.append("caption", caption)
      console.log(formdata)
        const response = await axios.post("/api/v1/post/createpost", formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log(response.data.user)

        toast.success("Create new post in few seconds")
        setTimeout(() => {
            navigate("/profile")
        }, 2500)
        
    } catch (error) {

      console.log("error in createPost file in send file fumction")
      console.log(error)
      alert(`${error.response.status} , ${error.response.statusText} \n ${error.response.data.message}`)

    }
  }
  //------------------------------------------------------------------------------------------------

  if(!image){
    return (
      <div className="flex items-center justify-center bg-black">

<ToastContainer
position="top-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={true}
pauseOnFocusLoss
draggable={false}
pauseOnHover={false}
theme="dark"
transition: Bounce
/>
  
        <div className='w-1/5 min-h-screen'></div>
  
        <div className='w-4/5 min-h-screen'>
  
          <div className='flex flex-col items-start justify-start mt-[50px] ml-[50px]'>
  
            <form action="" onSubmit={sendFile} formEncType='multipart/form-data' className='flex flex-col items-start justify-start gap-5'>
  
              <input value={caption} onChange={(e) => setcaption(e.target.value)} type="text" placeholder='Write Caption ..............' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] w-[400px] h-[50px]'/>
  
              <div className='' onClick={handleClick}>
  
                <input type="file" name="" ref={clickFile} onChange={handleChange} className='text-white border-[2px] border-yellow-600 bg-yellow-600 w-[200px] cursor-pointer hidden'/>
  
                <div className='dotted w-[400px] h-[400px] relative cursor-pointer'>

                  <div className='h-[1px] w-[300px] bg-zinc-600 absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]'></div>

                  <div className='h-[1px] w-[300px] bg-zinc-600 absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] rotate-[90deg]'></div>
                  
                </div>
  
              </div>
  
              <input type="submit" value="Post" className='text-white text-[18px] mt-[20px] bg-yellow-600 px-7 py-2 rounded-[10px] cursor-pointer'/>
  
            </form>
  
          </div>
  
        </div>
  
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center bg-black">

<ToastContainer
position="top-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={true}
pauseOnFocusLoss
draggable={false}
pauseOnHover={false}
theme="dark"
transition: Bounce
/>

      <div className='w-1/5 min-h-screen'></div>

      <div className='w-4/5 min-h-screen'>

        <div className='flex flex-col items-start justify-start mt-[50px] ml-[50px]'>

          <form action="" onSubmit={sendFile} formEncType='multipart/form-data' className='flex flex-col items-start justify-start gap-5'>

            <input value={caption} type="text" onChange={(e) => setcaption(e.target.value)} placeholder='Write Caption ..............' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] w-[400px] h-[50px]'/>

            <div className='' onClick={handleClick}>

              <input type="file" name="" ref={clickFile} onChange={handleChange} className='text-white border-[2px] border-yellow-600 bg-yellow-600 w-[200px] cursor-pointer hidden'/>

                
                {check === "image" ? (
                  <div className='w-[400px] h-[400px] overflow-hidden'>
                    <img src={URL.createObjectURL(image)} className='w-full h-full object-cover object-center' alt="" />
                  </div>
                ) : (
                  <div className='w-[400px] h-[400px] overflow-hidden'>
                    <video src={URL.createObjectURL(image)} className='w-full h-full object-cover object-center' controls muted></video>
                  </div>
                )}

            </div>

            <input type="submit" value="Post" className='text-white text-[18px] mt-[20px] bg-yellow-600 px-7 py-2 rounded-[10px] cursor-pointer'/>

          </form>

        </div>

      </div>

    </div>
  )
}

export default CreatePost