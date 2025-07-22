import React, { useEffect, useRef, useState } from 'react'
import "./Navbar.css"
import { IoHomeOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { MdOutlineExplore } from "react-icons/md";
import { FiPlayCircle } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaThreads } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


function Navbar() {

  let user = JSON.parse(localStorage.getItem("user"))
  const location = useLocation()

  
    return (
        <>
        <div className='flex flex-col items-center justify-center w-1/5 h-screen bg-black fixed z-[100] top-0 left-0 border-r-[1px] border-zinc-700'>
    
            <div className='w-full h-[10%] flex items-center justify-start pl-[30px]'>
              <h1 className='text-white pacifico-regular text-[30px]'>linkHub</h1>
            </div>
    
            <div className='w-full h-[70%] flex flex-col items-center justify-start gap-[5px] px-[10px]'>
    
              <NavLink to='/feed' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <IoHomeOutline className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Home</h1>
              </NavLink>
    
              <NavLink to='/search' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FiSearch className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Search</h1>
              </NavLink>
    
              <NavLink to='/explore' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <MdOutlineExplore className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Explore</h1>
              </NavLink>
    
              <NavLink to='/reels' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FiPlayCircle className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Reels</h1>
              </NavLink>
    
              <NavLink to='/message' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FiMessageCircle className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Messages</h1>
              </NavLink>
    
              <NavLink to='/notification' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FaRegHeart className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Notifications</h1>
              </NavLink>
    
              <NavLink to='/createpost' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FaRegSquarePlus className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Create</h1>
              </NavLink>
    
              <NavLink to={location.pathname == "/savepost" ? "/savepost" : "/profile"} className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <div className='w-[25px] h-[25px] rounded-full overflow-hidden  transition-all duration-[0.3s] group-hover:scale-[1.1]'>
                  <img src= {user.avatar == "default-avatar.jpeg" ? `../public/default/${user.avatar}` : `${user.avatar}`} className='w-full h-full object-cover object-center' /></div>
                <h1 className='text-white text-[20px] font-[500]'>Profile</h1>
              </NavLink>
    
            </div>
    
            <div className='w-full h-[20%] flex flex-col gap-[5px] justify-center items-center px-[10px]'>
    
              <NavLink to='/threads' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FaThreads className='text-white text-[25px]  transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>Threads</h1>
              </NavLink>
    
              <NavLink to='/more' className={({isActive}) => `${isActive ? "bg-zinc-800" : "bg-black"} w-full h-[52px] cursor-pointer flex items-center justify-start pl-[15px] rounded-[8px] gap-3 hover:bg-zinc-800 group`}>
                <FiMenu className='text-white text-[25px] transition-all duration-[0.3s] group-hover:scale-[1.1]'/>
                <h1 className='text-white text-[20px] font-[500]'>More</h1>
              </NavLink>
    
            </div>
    
        </div>
        </>
      )
}

export default Navbar