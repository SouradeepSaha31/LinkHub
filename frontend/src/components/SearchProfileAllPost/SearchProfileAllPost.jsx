import React, { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { TbLibraryPlus } from "react-icons/tb";
import path from "path-browserify"


function SearchProfileAllPost(props) {
  const {user_id} = props

  const [data, setdata] = useState([])
  const [likeCompleted, setlikeCompleted] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate()

  let likeposts = JSON.parse(localStorage.getItem("likeposts"))
  let saveposts = JSON.parse(localStorage.getItem("saveposts"))

  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };
  
  const restoreScrollPosition = () => {
    console.log(scrollPosition)
    window.scrollTo(0,scrollPosition);
  };


  // likeposts -------------------------------------------------------------------------------------

  const likePosts = async (postId) => {
    try {

      saveScrollPosition();

      const response = await axios.post(`/api/v1/likepost/like/${postId}`)

      localStorage.setItem("likeposts", JSON.stringify(response.data.likeposts))

      setlikeCompleted(!likeCompleted)

      navigate(`/searchprofileallpost/${user_id}`)

    } catch (error) {
      console.log(error)
    }
  }

  //-----------------------------------------------------------------------------------------------

  //savepost --------------------------------------------------------------------------------------------

const savepost = async (postid) => {
  try {
    const response = await axios.post(`/api/v1/savepost/postsave/${postid}`)
    
    console.log(response.data.saveposts)
    
    localStorage.setItem("saveposts", JSON.stringify(response.data.saveposts))
    
    navigate(`/searchprofileallpost/${user_id}`)
    
    
    } catch (error) {
      console.log(error)
      alert("error in savepost function in Feed")
      }
}
      
//----------------------------------------------------------------------------------------------------

  //useeffect------------------------------------------------------------------------------------------
    useEffect(() => {

        const fetchdata = async () => {
          try {

            const response = await axios.post(`/api/v1/ownerpost/showsearchuserpost/${user_id}`)
            setdata(response.data)
            restoreScrollPosition();
        
          } catch (error) {
            console.log(error)
          }
        }
    
    fetchdata()
  },[likeCompleted])
  //----------------------------------------------------------------------------------------------------

    return (
        <div className="w-full min-h-screen bg-black flex justify-start items-center">
            <div className="min-h-screen w-1/5"></div>
    
            <div className="min-h-screen w-4/5 flex justify-start items-start">
    
                <div className='min-h-screen w-2/3 px-5 py-2 border-r-[1px] border-zinc-700'>
    
                <div className="w-full flex flex-col items-center justify-start gap-4 py-2">
                {/* post */}
    
                {
                  data.slice().reverse().map((post, index) => (
    
                  <div key={index} className="w-2/3">
                  <div className="w-full h-[50px] flex items-center justify-start gap-2 mb-1">
                    <div className="w-[40px] h-[40px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center">
                      <img
                        src= {post.userDet.avatar === "default-avatar.jpeg" ? `../public/default/${post.userDet.avatar}` : `${post.userDet.avatar}`}
                        className="rounded-full w-[33px] h-[33px]  object-cover object-center"
                        alt=""
                      />
                    </div>
                    <h1 className="text-white text-[18px] font-semibold">
                      {post.userDet.userId}
                    </h1>
                  </div>
                  <h1 className="text-zinc-400 leading-[22px] mb-3 text-[18px]">{post.postDet.caption}</h1>
    
                    {
                      path.extname(post.postDet.file) === ".jpg" || path.extname(post.postDet.file) === ".jpeg" || path.extname(post.postDet.file) === ".png" ? (
    
                        <div className="w-full h-[400px] rounded-[10px] overflow-hidden">
                          <img
                            src={post.postDet.file}
                            className="w-full h-full object-cover object-center"
                            alt=""
                          />
                        </div>
    
                      ) : (
    
                        <div className="w-full h-[400px] rounded-[10px] overflow-hidden">
                          <video
                            src={post.postDet.file}
                            className="w-full h-full object-cover object-center"
                            alt=""
                          ></video>
                        </div>
    
                      )
                    }
    
                  
                  <div className="w-full min-h-[50px] pt-3 pb-2 border-b-[1px] border-zinc-700 flex flex-col items-start justify-start gap-1 ">
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex items-center justify-start gap-3">
                      <FaRegHeart onClick={() => likePosts(post.postId)} className={`${likeposts.indexOf(post.postId) === -1 ? "text-white" : "text-red-600"} hover:scale-[1.1] transition-all text-[25px] cursor-pointer`} />
                      <FaRegCommentAlt className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                      <PiShareFatBold className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                      </div>
                      <div>
                      <TbLibraryPlus onClick={() => savepost(post.postId)} className={`${saveposts.indexOf(post.postId) === -1 ? "text-white" : "text-green-600"} text-[25px] cursor-pointer hover:scale-[1.1] transition-all`}/>
                      </div>
                     
                    </div>
                    <h1 className="text-white text-[18px] font-semibold">
                      {post.likeCount} Likes
                    </h1>
                  </div>
                </div>
    
                  ))
                }
    
              </div>
    
                </div>
    
                <div className="min-h-screen w-1/3 px-5 py-5"></div>
    
            </div>
    
        </div>
      )
}

export default SearchProfileAllPost