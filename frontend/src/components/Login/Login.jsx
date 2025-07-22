import React, { useState } from 'react'
import "./Login.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [userId, setuserId] = useState("")
  const [password, setpassword] = useState("")
  const navigate = useNavigate()

  // const user = {userId, password}
  // console.log(user)

  const login = async (e) => {
    e.preventDefault();

    const user = {userId, password}

    try {
      const response = await axios.post("/api/v1/user/login", user)
      console.log("Successfully loged in")
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("saveposts", JSON.stringify(response.data.saveposts))
      localStorage.setItem("likeposts", JSON.stringify(response.data.likeposts))
      localStorage.setItem("following", JSON.stringify(response.data.following))
      localStorage.setItem("likecomments", JSON.stringify(response.data.likecomments))
      toast.success("Login in few seconds")
      setTimeout(() => {
        navigate("/profile")
      }, 2500)
    } catch (error) {
      console.log("unsuccessfully not logged in")
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
rtl={true}
pauseOnFocusLoss
draggable={false}
pauseOnHover={false}
theme="dark"
transition: Bounce
/>

      <div className='w-[400px] h-[310px] gap-4 flex flex-col px-[50px] py-[15px] justify-start items-center bg-zinc-800 rounded-[10px]'>

        <h1 className='pacifico-regular text-white text-[40px]'>LinkHub</h1>

        <form action="" onSubmit={login} className='flex flex-col gap-3 w-full'>

          <input type="text" onChange={(e) => setuserId(e.target.value)} placeholder='User Id' name='userId' className='w-[full] border-2 border-zinc-500 bg-transparent h-[50px] rounded-[10px] text-white px-3 py-2 outline-none text-[18px]'/>

          <input type="password" onChange={(e) => setpassword(e.target.value)} placeholder='Password' name='password' className='w-[full] border-2 border-zinc-500 bg-transparent h-[50px] rounded-[10px] text-white px-3 py-2 outline-none text-[18px]'/>

          <input type="submit" value={"Log In"} className='w-full h-[50px] text-white bg-yellow-700 rounded-[10px] mt-3 cursor-pointer text-[18px] font-semibold'/>

        </form>

      </div>

      <div className='flex justify-center items-center gap-3'>
        <h1 className='text-white text-[15px]'>Do not have an Account ?</h1>
        <Link to="/signup" className='text-blue-500 text-[17px]'>Sign Up</Link>
      </div>

    </div>
  )
}

export default Login