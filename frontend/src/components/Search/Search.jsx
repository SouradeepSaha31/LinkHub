import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"

import { RxCross2 } from "react-icons/rx";


function Search() {
  const navigate = useNavigate()

  const [search, setsearch] = useState()
  const [searchUser, setsearchUser] = useState([])
  const [togglesearch, settogglesearch] = useState(false)

  // search Submit ----------------------------------------------------------------------------------
  const searchSubmit = async (e) => {
    e.preventDefault()
    let data = {userId: search}
    try {

      const response = await axios.post("/api/v1/searchuser/usersearch", data)
      
      if (response.data === "the loggedin user put his own userId") {
        navigate("/profile")
      } else if (response.data === "no user found") {
        // console.log(response.data)
        setsearchUser([])
        // console.log(searchUser)
      } else {
        settogglesearch(!togglesearch)
        navigate("/search")
      }
      
    } catch (error) {
      console.log("error in seasrch Submit in search.jsx")
      console.log(error)
    }
  }
  // -------------------------------------------------------------------------------------------------

  // get request --------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchdata = async () => {
      try {

        const response = await axios.get("/api/v1/searchuser/showsearchuser")
        setsearchUser(response.data)
        
      } catch (error) {
        console.log("error in get request in Search.jsx")
        console.log(error)
      }
    }
    fetchdata()
  }, [togglesearch])
  
  //--------------------------------------------------------------------------------------------------

  // delete search -----------------------------------------------------------------------------------
  const deleteSearch = async (id) => {
    try {
      console.log("first")
      const response = await axios.post(`/api/v1/searchuser/deletesearch/${id}`)
      if(response.data === "ok"){
        settogglesearch(!togglesearch)
        navigate("/search")
      }
      
    } catch (error) {
      console.log("error in deleteSearch function in Search.jsx")
      console.log(error)
    }
    
  }
  //---------------------------------------------------------------------------------------------------

  const showSearchProfile = async (user_id) => {
    navigate(`/showsearchedprofile/${user_id}`)
  }

    return (
      <div className="flex w-full min-h-screen items-center justify-center bg-black">
  
        <div className='w-1/5 min-h-screen'></div>
  
        <div className='w-4/5 min-h-screen flex justify-center items-start'>
  
          <div className='flex flex-col items-center justify-center gap-7 mt-[100px]'>
  
            <form action="" onSubmit={searchSubmit} className='flex items-center justify-center'>
              <input type="search" name="search" onChange={(e) => setsearch(e.target.value)} placeholder='Search user Id' className='bg-transparent border-[2px] border-yellow-600 outline-none text-white px-3 py-1 text-[18px] rounded-l-[10px] w-[400px] h-[50px] ' />
              <input type="submit" value="Search" className='text-white text-[18px] bg-yellow-600 px-3 py-1 h-[50px] rounded-r-[10px] cursor-pointer'/>
            </form>
  
            <div className='w-full flex flex-col items-center justify-center gap-3'>

              {
                searchUser.length === 0 ? (
                  <div className='text-[20px] text-green-600 font-semibold'>
                    no user founded
                  </div>            
                ) : (
                  <>
                          {
                    searchUser.slice().reverse().map((user, index) => (

                      <Link onClick={() => showSearchProfile(user.searchedUserDet._id)} key={index} className="w-full h-[80px] px-3 flex items-center justify-between gap-3 border-[2px] border-yellow-600 rounded-[10px]">
  
                        <div className='flex items-center justify-center gap-3'>

                          <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-gradient-to-r from-yellow-400 to-red-600 flex justify-center items-center">
                            <img src= {user.searchedUserDet.avatar == "default-avatar.jpeg" ? `./public/default/${user.searchedUserDet.avatar}` : `${user.searchedUserDet.avatar}`} className="w-[56px] h-[56px] border-4 border-black rounded-full object-cover object-center" alt="" />
                          </div>
    
                          <div className="flex flex-col justify-center items-start ">
                            <h1 className="text-white text-[20px] font-semibold">{user.searchedUserDet.userId}</h1>
                            <h1 className="text-zinc-500 text-[14px]">{user.searchedUserDet.fullname}</h1>
                          </div>

                        </div>

                        <div onClick={(e)=> (
                          e.preventDefault(),
                          e.stopPropagation(),
                          deleteSearch(user._id)
                        )} className='w-[32px] h-[32px] flex justify-center items-center'>
                          <RxCross2 className='text-white text-[30px]'/>
                        </div>
    
                      </Link>

                    ))
                  }
                  </>
                )
              }
  
                  
                
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    )
}

export default Search