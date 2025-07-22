import React, { useState } from 'react'
import "./Signup.css"
import { Link } from 'react-router-dom'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate()

  const [fullname, setfullname] = useState("")
  const [userId, setuserId] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  // const user = {fullname, userId, email, password}
  // console.log(user)

  const signup = async (e) => {
    e.preventDefault();

    const user = {fullname, userId, email, password}

    try {
      const response = await axios.post("/api/v1/user/signup", user)
      console.log("successfully registered")
      // console.log(response)
      localStorage.setItem("user", JSON.stringify(response.data.user)) 
      localStorage.setItem("saveposts", JSON.stringify(response.data.saveposts)) 
      localStorage.setItem("likeposts", JSON.stringify(response.data.likeposts)) 
      localStorage.setItem("following", JSON.stringify(response.data.following)) 
      localStorage.setItem("likecomments", JSON.stringify(response.data.likecomments)) 
      toast.success("Signup in few seconds")
      setTimeout(() => {
        navigate("/profile")
      }, 2500)

    } catch (error) {
      console.log("unsuccessful not regitered")
      console.log(error)
      alert(`${error.response.status} , ${error.response.statusText} \n ${error.response.data.message}`)
    }

  }
  return (
    <div className='w-full min-h-screen bg-black flex flex-col gap-5 items-center justify-center'>

<ToastContainer
position="top-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable={false}
pauseOnHover={false}
theme="dark"
transition: Bounce
/>

      <div className='w-[400px] h-[430px] gap-4 flex flex-col px-[50px] py-[15px] justify-start items-center bg-zinc-800 rounded-[10px]'>

        <h1 className='pacifico-regular text-white text-[40px]'>LinkHub</h1>

        <form action=""  onSubmit={signup} className='flex flex-col gap-3 w-full'>

          <input type="text" onChange={(e) => setfullname(e.target.value)} placeholder='Full Name' name='fullname' className='w-[full] border-2 border-zinc-500 bg-transparent h-[50px] rounded-[10px] text-white px-3 py-2 outline-none text-[18px]'/>

          <input type="text" onChange={(e) => setuserId(e.target.value)} placeholder='User Id' name='userId' className='w-[full] border-2 border-zinc-500 bg-transparent h-[50px] rounded-[10px] text-white px-3 py-2 outline-none text-[18px]'/>

          <input type="email" onChange={(e) => setemail(e.target.value)} placeholder='Email' name='email' className='w-[full] border-2 border-zinc-500 bg-transparent h-[50px] rounded-[10px] text-white px-3 py-2 outline-none text-[18px]'/>

          <input type="password" onChange={(e) => setpassword(e.target.value)} placeholder='Password' name='password' className='w-[full] border-2 border-zinc-500 bg-transparent h-[50px] rounded-[10px] text-white px-3 py-2 outline-none text-[18px]'/>

          <input type="submit" value={"Sign Up"} className='w-full h-[50px] text-white bg-yellow-700 rounded-[10px] mt-3 cursor-pointer text-[18px] font-semibold'/>

        </form>

      </div>

      <div className='flex justify-center items-center gap-3'>
        <h1 className='text-white text-[15px]'>Have an Account ?</h1>
        <Link to="/login" className='text-blue-500 text-[17px]'>Log in</Link>
      </div>

    </div>
  )
}

export default Signup