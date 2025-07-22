import React, {useState, useRef, useEffect} from 'react'
import path from "path-browserify"
import "./Editprofile.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Editprofile(props) {
    const {user} = props

    // updates --------------------------------------------------------------------------------------
    const navigate = useNavigate()
    const [fullname, setfullname] = useState(null)
    const [bio, setbio] = useState(null)
    const [userid, setuserid] = useState(null)
    const [email, setemail] = useState(null)
    const [currpassword, setcurrpassword] = useState(null)
    const [newpassword, setnewpassword] = useState(null)
    const [conpassword, setconpassword] = useState(null)
    // let data = {fullname, bio, userid, email, currpassword, newpassword, conpassword}
    // console.log(data)

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        let data = {fullname, bio, userid, email, currpassword, newpassword, conpassword}
        console.log(data)
        const response = await axios.post("/api/v1/user/updateprofiledetailes", data)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        toast.success("Update changes in few seconds")
        setTimeout(() => {
          navigate("/profile")
        }, 2500)
       } catch (error) {
        console.log("error in handleSubmit in Editprofile: ", error)
        alert(`${error.response.status} , ${error.response.statusText} \n ${error.response.data.message}`)
       }
    }
    // ---------------------------------------------------------------------------------------------

    // Current and New password toggle show ---------------------------------------------------------
    const [showCurrentPassword, setshowCurrentPassword] = useState(false)
    const togglecurrpassword = () => {
      setshowCurrentPassword(!showCurrentPassword)
      console.log(showCurrentPassword)
    }
    const [showNewPassword, setshowNewPassword] = useState(false)
    const togglenewpassword = () => {
      setshowNewPassword(!showNewPassword)
      console.log(showCurrentPassword)
    }
    //-------------------------------------------------------------------------------------------------

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
    
          <div className='w-4/5 min-h-screen p-[25px]'>
    
            <div className='flex flex-col items-start justify-start'>
    
              <form action="" onSubmit={handleSubmit} className='flex flex-col items-start justify-start gap-5'>
    
                <div className='flex justify-center items-center'>
                    <label htmlFor="fullname" className='text-white cursor-pointer text-[20px]'>Fullname:</label>
                    <input type="text" name='' value={fullname === null ? user.fullname : fullname} onChange={(e) => setfullname(e.target.value)} id='fullname' placeholder='fullname' className='bg-transparent border-[2px] ml-[130px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] w-[400px] h-[50px]'/>
                </div>

                <div className='flex justify-center items-start'>
                    <label htmlFor="bio" className='text-white cursor-pointer text-[20px]'>Bio:</label>
                    <textarea type="text" name='' onChange={(e) => setbio(e.target.value)} id='bio' placeholder='bio' className='bg-transparent border-[2px] border-yellow-600 resize-none ml-[185px] outline-none text-white px-3 py-1 text-[18px] rounded-[10px] w-[400px] h-[120px]'>{bio === null ? user.bio : bio}</textarea>
                </div>

                <div className='flex justify-center items-center'>
                    <label htmlFor="userid" className='text-white cursor-pointer text-[20px]'>Userid:</label>
                    <input type="text" name='' value={userid === null ? user.userId : userid} onChange={(e) => setuserid(e.target.value)} id='userid' placeholder='userid' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] ml-[155px] w-[400px] h-[50px]'/>
                </div>

                <div className='flex justify-center items-center'>
                    <label htmlFor="email" className='text-white cursor-pointer text-[20px]'>Email:</label>
                    <input type="email" name='' value={email === null ? user.email : email} onChange={(e) => setemail(e.target.value)} id='email' placeholder='email' className='bg-transparent border-[2px] border-yellow-600 outline-none ml-[165px] text-white px-3 py-1 text-[18px] rounded-[10px] w-[400px] h-[50px]'/>
                </div>

                <div className='flex justify-center items-center relative'>
                    <label htmlFor="password" className='text-white cursor-pointer text-[20px]'>Current Password:</label>
                    <input type={showCurrentPassword ? "text" : "password"} name='' onChange={(e) => setcurrpassword(e.target.value)} id='password' placeholder='current password' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] ml-[55px] w-[400px] h-[50px]'/>

                    <div onClick={togglecurrpassword} className='w-[25px] h-[25px] cursor-pointer absolute top-[13px] right-[13px] rounded-full'>
                      <BsFillEyeFill className={`${showCurrentPassword ? "block" : "hidden"} text-white text-[20px] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]`}/>
                      <BsFillEyeSlashFill className={`${showCurrentPassword ? "hidden" : "block"} text-white text-[20px] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]`}/>
                    </div>

                </div>

                <div className='flex justify-center items-center relative'>
                    <label htmlFor="newpassword" className='text-white cursor-pointer text-[20px]'>New Password:</label>
                    <input type={showNewPassword ? "text" : "password"} name='' readOnly={currpassword == null || currpassword == "" ? true : false} onChange={(e) => setnewpassword(e.target.value)} id='newpassword' placeholder='new password' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] ml-[80px] w-[400px] h-[50px]'/>

                    <div onClick={togglenewpassword} className='w-[25px] h-[25px] cursor-pointer absolute top-[13px] right-[13px] rounded-full'>
                      <BsFillEyeFill className={`${showNewPassword ? "block" : "hidden"} text-white text-[20px] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]`}/>
                      <BsFillEyeSlashFill className={`${showNewPassword ? "hidden" : "block"} text-white text-[20px] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]`}/>
                    </div>

                </div>

                <div className='flex justify-center items-center'>
                    <label htmlFor="confirmpassword" className='text-white cursor-pointer text-[20px]'>Confirm Password:</label>
                    <input type="text" name='' readOnly={newpassword == null || newpassword == "" ? true : false} onChange={(e) => setconpassword(e.target.value)} id='confirmpassword' placeholder='confirm password' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-[10px] ml-[50px] w-[400px] h-[50px]'/>
                </div>
    
    
                <input type="submit" value="Update Detailes" className='text-white text-[18px] bg-yellow-600 px-4 py-2 rounded-[10px] mt-[15px] cursor-pointer'/>
    
              </form>
    
            </div>
    
          </div>
    
        </div>
      )  
    
}

export default Editprofile