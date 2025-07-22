import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { TbLibraryPlus } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";


import axios from "axios";
import path from "path-browserify"

import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./Feed.css";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";

function Feed() {
  
  let user = JSON.parse(localStorage.getItem("user"))
  let following = JSON.parse(localStorage.getItem("following"))
  let saveposts = JSON.parse(localStorage.getItem("saveposts"))
  let likeposts = JSON.parse(localStorage.getItem("likeposts"))
  let likecomments = JSON.parse(localStorage.getItem("likecomments"))
  const navigate = useNavigate()

  const [data, setdata] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0);
  const [likeCompleted, setlikeCompleted] = useState(false)
  const [postDetInCommentBox, setpostDetInCommentBox] = useState(null)
  const [comments, setcomments] = useState([])
  const [singleComment, setsingleComment] = useState("")
  const [togglecomment, settogglecomment] = useState(false)
  const [toggleLikeBox, settoggleLikeBox] = useState(false)
  const [userWhoAreLike, setuserWhoAreLike] = useState(null)

const saveScrollPosition = () => {
  setScrollPosition(window.scrollY);
};

const restoreScrollPosition = () => {
  console.log(scrollPosition)
  window.scrollTo(0,scrollPosition);
};
// handle scrolling ====================================================================================
const handleScrolling = () => {
  settogglecomment(false)
  
  restoreScrollPosition()
}
//==================================================================================================

//useeffect------------------------------------------------------------------------------------------
useEffect(() => {
            
  const fetchdata = async () => {
    try {

      const response = await axios.get("/api/v1/post/showpost")
      setdata(response.data)
      restoreScrollPosition();
    } catch (error) {
      console.log(error)
    }
  }
  
  fetchdata()
},[likeCompleted])

//----------------------------------------------------------------------------------------------------

//savepost --------------------------------------------------------------------------------------------

const savepost = async (postid) => {
  try {
    const response = await axios.post(`/api/v1/savepost/postsave/${postid}`)
    
    console.log(response.data.saveposts)
    
    localStorage.setItem("saveposts", JSON.stringify(response.data.saveposts))
    
    navigate("/feed")
    
    
    } catch (error) {
      console.log(error)
      alert("error in savepost function in Feed")
      }
}
      
//----------------------------------------------------------------------------------------------------
      
// likeposts -------------------------------------------------------------------------------------
      
      const likePosts = async (postId, whereIClicked) => {
        try {

          saveScrollPosition();
          
          const response = await axios.post(`/api/v1/likepost/like/${postId}`)
          
          localStorage.setItem("likeposts", JSON.stringify(response.data.likeposts))

          if (whereIClicked === "inpost") {
            setlikeCompleted(!likeCompleted)
          } else {
            setlikeCompleted(!likeCompleted)
            CommentShow(postId)
          }

          navigate("/feed")
          
          } catch (error) {
            console.log(error)
          }
      }
            
//-----------------------------------------------------------------------------------------------

// CommentShow ----------------------------------------------------------------------------------------
const CommentShow = async (postId) => {
  try {

    saveScrollPosition()

    const response = await axios.post(`/api/v1/comment/commentshow/${postId}`)
    console.log(response.data)
    setpostDetInCommentBox(response.data.findOwner)
    setcomments(response.data.findComment)
    settogglecomment(true)
    setlikeCompleted(!likeCompleted)
    
  } catch (error) {
    console.log("error in comment show function in feed.jsx")
    console.log(error)
  }
}
//-------------------------------------------------------------------------------------------------

// doComment ----------------------------------------------------------------------------------------
const doComment = async (postid) => {
  try {

    console.log(postid)
    console.log(singleComment)
    let oneComment = { singleComment }

    const response = await axios.post(`/api/v1/comment/commentdo/${postid}`, oneComment)
    console.log(response.data)
    setsingleComment("")
    CommentShow(postid)
    
    
  } catch (error) {
    console.log("error in do comment function in feed.jsx")
    console.log(error)
  }
}
//-------------------------------------------------------------------------------------------------

// likeComment ------------------------------------------------------------------------------------
const likeComment = async (commentId, postId) => {
  try {

    const response = await axios.post(`/api/v1/likecomment/likethecomment/${commentId}`)

    localStorage.setItem("likecomments", JSON.stringify(response.data.likecomments))

    CommentShow(postId)
    
  } catch (error) {
    console.log("error ln likeComment function in feed.jsx")
    console.log(error)
  }
}
//-----------------------------------------------------------------------------------------------

// follow click ---------------------------------------------------------------------------------
const follow = async (user_id) => {
  try {

    const response = await axios.post(`/api/v1/follow/followclick/${user_id}`)

    localStorage.setItem("following", JSON.stringify(response.data.following))

    navigate(`/feed`)
    
  } catch (error) {
    console.log("error in follow function in ShowSearchProfile.jsx")
    console.log(error)
  }
}
//---------------------------------------------------------------------------------------------------

// likeBox -----------------------------------------------------------------------------------------
const likeBox = async (postId) => {
  try {

    console.log(postId)

    const response = await axios.post(`/api/v1/likepost/likeshowinlikebox/${postId}`)

    setuserWhoAreLike(response.data)

    settoggleLikeBox(true)
    
  } catch (error) {
    console.log("error in likeBox function in feed.jsx")
    console.log(error)
  }
}
//-------------------------------------------------------------------------------------------------

// redirectToClickProfile ---------------------------------------------------------------------
const redirectToClickProfile = (user_id) => {
  if (user_id === user._id) {
    navigate("/profile")
  } else {
    navigate(`/showsearchedprofile/${user_id}`)
  }
}
//------------------------------------------------------------------------------------------------




  return (
    <div className="w-full min-h-screen bg-black flex justify-start items-center">
      <div className="min-h-screen w-1/5"></div>

      <div className="min-h-screen overflow-hidden w-4/5 relative flex justify-start items-start">

        <div className="min-h-screen w-2/3 px-5 py-2 border-r-[1px] border-zinc-700">

          <div className="w-full h-[100px] border-b-[1px] border-zinc-700">
            
            <Swiper
              slidesPerView={9}
              spaceBetween={0}
              freeMode={true}
              modules={[FreeMode, Pagination]}
              className="mySwiper w-full h-full"
            >
              <SwiperSlide>
                <div className='w-[70px] h-[70px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center'>
                  <img src={user.avatar === "default-avatar.jpeg" ? `./public/default/${user.avatar}` : `${user.avatar}`} className='rounded-full w-[66px] h-[66px] object-cover object-center border-4 border-black' alt="" />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="w-full flex flex-col items-center justify-start gap-4 py-2">
            {/* post */}

            {
              data.length === 0 ? (
                <p className="text-green-500 font-semibold text-[20px]">no post yet</p>
              ) : (
                <>
                      {
              data.slice().reverse().map((post, index) => (

              <div key={index} className="hello w-2/3">
              <div className="w-full h-[50px] flex items-center justify-start gap-2 mb-1">
                <div onClick={() => redirectToClickProfile(post.ownerDet._id)} className="w-[40px] h-[40px] bg-gradient-to-r from-yellow-400 to-red-700 cursor-pointer rounded-full flex justify-center items-center">
                  <img
                    src= {post.ownerDet.avatar === "default-avatar.jpeg" ? `./public/default/${post.ownerDet.avatar}` : `${post.ownerDet.avatar}`}
                    className="rounded-full border-4 border-black w-[36px] h-[36px]  object-cover object-center"
                    alt=""
                  />
                </div>
                <h1 onClick={() => redirectToClickProfile(post.ownerDet._id)} className="text-white text-[18px] font-semibold cursor-pointer">
                  {post.ownerDet.userId}
                </h1>
                {
                  post.ownerDet._id === user._id ? (
                    <div></div>
                  ) : (
                    <h1 onClick={() => follow(post.ownerDet._id)} className="text-blue-500 text-[16px] cursor-pointer">
                        {following.indexOf(post.ownerDet._id) === -1 ? "Follow" : "Following"}
                    </h1>
                  )
                }
              </div>
              <h1 className="text-zinc-400 leading-[22px] mb-3 text-[18px]">{post.caption}</h1>

                {
                  path.extname(post.file) === ".jpg" || path.extname(post.file) === ".jpeg" || path.extname(post.file) === ".png" ? (

                    <div className="w-full h-[400px] rounded-[10px] overflow-hidden">
                      <img
                        src={post.file}
                        className="w-full h-full object-cover object-center"
                        alt=""
                      />
                    </div>

                  ) : (

                    <div className="w-full h-[400px] rounded-[10px] overflow-hidden">
                      <video
                        src={post.file}
                        className="w-full h-full object-cover object-center"
                        alt=""
                      ></video>
                    </div>

                  )
                }

              
              <div className="w-full min-h-[50px] pt-3 pb-2 border-b-[1px] border-zinc-700 flex flex-col items-start justify-start gap-1">
              <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center justify-start gap-3">
                  <FaRegHeart onClick={() => likePosts(post._id, "inpost")} className={`${likeposts.indexOf(post._id) === -1 ? "text-white" : "text-red-600"} hover:scale-[1.1] transition-all text-[25px] cursor-pointer`} />
                  <FaRegCommentAlt onClick={()=> CommentShow(post._id)} className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                  <PiShareFatBold className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                  </div>
                  <div>
                    {
                      user._id === post.ownerDet._id ? (
                        <div></div>
                      ) : (
                        <TbLibraryPlus onClick={() => savepost(post._id)} className={`${saveposts.indexOf(post._id) === -1 ? "text-white" : "text-green-600"} text-[25px] cursor-pointer hover:scale-[1.1] transition-all`}/>
                      )
                    }
                  </div>
                </div>
                <div className="text-white text-[18px] cursor-pointer font-semibold flex justify-start items-center gap-3">
                  <h1 onClick={() => likeBox(post._id)} >{post.likeCount} Likes,</h1> 
                  <h1>{post.commentCount} Comments</h1>
                </div>
              </div>
            </div>

              ))
            }
                </>
              )
            }

            

          </div>
        </div>

        <div className="h-screen bg-red-70 fixed top-0 right-0 w-[360px] px-2 py-2">
          <div className="w-full h-[50px] flex items-center justify-start gap-3">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <img src={user.avatar === "default-avatar.jpeg" ? `./public/default/${user.avatar}` : `${user.avatar}`} alt="" />
            </div>
            <div className="flex flex-col justify-center items-start ">
            <h1 className="text-white text-[16px] font-semibold">{user.userId}</h1>
            <h1 className="text-zinc-500 text-[14px]">{user.fullname}</h1>
            </div>
          </div>
        </div>

      </div>

      {
        userWhoAreLike === null ? (
          <></>
        ) : (

          <div className={`w-full h-screen bg-[#00000095] fixed top-0 left-0 z-[300] ${toggleLikeBox ? "flex" : "hidden"} justify-center items-center`}>

          <div className="w-[400px] h-[400px] bg-zinc-900 rounded-[15px] overflow-hidden flex flex-col justify-center items-center">
  
              <div className="w-full h-[10%] relative border-b-[1px] border-zinc-700 flex justify-center items-center">
                  <h1 className="text-white font-semibold text-[17px]">Likes</h1>
                  <RxCross2 onClick={() => settoggleLikeBox(false)} className="text-white absolute top-[7px] right-[7px] cursor-pointer text-[25px]"/>
              </div>
  
              <div className="your-box w-full h-[90%] overflow-y-auto py-1 relative">
  
              {
                  userWhoAreLike.length === 0 ? (
                    <>
                    <h1 className='text-green-500 text-[19px] font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>0 Likes</h1>
                    </>
                  ) : (
                    <>
                          {
                  userWhoAreLike.slice().reverse().map((whoLikes, index) => (
  
                    <div key={index} className="w-full h-[60px] flex items-center justify-between px-3">
                    <div className="h-full flex justify-center items-center gap-2">
                          <div onClick={() => redirectToClickProfile(whoLikes.userDet._id)} className="w-[50px] h-[50px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center cursor-pointer">
                              <img src={whoLikes.userDet.avatar === "default-avatar.jpeg" ? `./public/default/${whoLikes.userDet.avatar}` : `${whoLikes.userDet.avatar}`} alt="" className="w-[46px] h-[46px] border-4 border-black rounded-full"/>
                          </div>
                          <h1 onClick={() => redirectToClickProfile(whoLikes.userDet._id)} className="text-white text-[17px] font-semibold cursor-pointer">
                              {whoLikes.userDet.userId}
                          </h1>
                    </div>
                    {
                      whoLikes.userId === user._id ? (
                        <></>
                      ) : (

                    <div onClick={() => follow(whoLikes.userId)} className={`${following.indexOf(whoLikes.userId) === -1 ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-500"} cursor-pointer text-[17px] font-semibold px-3 py-1 rounded-[10px]`}>
                        {following.indexOf(whoLikes.userId) === -1 ? "Follow" : "Following"}
                    </div>
                      )
                    }
                </div>
  
                  ))
                }
                    </>
                  )
                }
                  
  
              </div>
  
          </div>
  
        </div>

        )
      }

      

      {
        postDetInCommentBox === null ? (
          <div></div>
        ) : (
          <div className={`w-full h-screen z-[200] fixed top-0 left-0 bg-[#00000095] ${togglecomment ? "flex" : "hidden"} justify-center items-center`}>
          <RxCross2 onClick={handleScrolling} className="text-white absolute top-[10px] right-[10px] cursor-pointer text-[30px]"/>

          <div className="w-[900px] h-[650px] flex">

            <div className="h-full w-[40%] bg-zinc-900 rounded-l-[10px] flex items-center justify-center">
            {
                path.extname(postDetInCommentBox.postDet.file) === ".jpg" || path.extname(postDetInCommentBox.postDet.file) === ".jpeg" || path.extname(postDetInCommentBox.postDet.file) === ".png" ? (

                  <div className="w-full h-[350px] overflow-hidden bg-violet-600">
                    <img className="w-full h-full object-cover object-center" src={postDetInCommentBox.postDet.file} alt="" />
                  </div>

                ) : (

                  <div className="w-full h-[350px] overflow-hidden bg-violet-600">
                      <video
                        src={postDetInCommentBox.postDet.file}
                        className="w-full h-full object-cover object-center"
                        alt=""
                      ></video>
                  </div>

                )
              }
            </div>

            <div className="h-full w-[60%] rounded-r-[10px] flex flex-col justify-start items-center bg-zinc-900">

              <div className="w-full h-[10%] px-3 border-b-[1px] border-zinc-700 flex items-center justify-start gap-2">
                <div onClick={() => redirectToClickProfile(postDetInCommentBox.ownerDet._id)} className="w-[40px] h-[40px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center cursor-pointer">
                  <img
                    src={postDetInCommentBox.ownerDet.avatar === "default-avatar.jpeg" ? `./public/default/${postDetInCommentBox.ownerDet.avatar}` : `${postDetInCommentBox.ownerDet.avatar}`}
                    className="rounded-full border-4 border-black w-[36px] h-[36px]  object-cover object-center"
                    alt=""
                  />
                </div>
                <h1 onClick={() => redirectToClickProfile(postDetInCommentBox.ownerDet._id)} className="text-white text-[18px] font-semibold cursor-pointer">
                  {postDetInCommentBox.ownerDet.userId}
                </h1>
                {
                  postDetInCommentBox.ownerDet._id === user._id ? (
                    <div></div>
                  ) : (
                    <h1 onClick={() => follow(postDetInCommentBox.ownerDet._id)} className="text-blue-500 text-[16px] cursor-pointer">
                        {following.indexOf(postDetInCommentBox.ownerDet._id) === -1 ? "Follow" : "Following"}
                    </h1>
                  )
                }
              </div>

              <div className="your-box w-full h-[70%] border-b-[1px] overflow-y-auto relative border-zinc-700">

                  {
                    comments.length === 0 ? (
                      <div className="text-white font-semibold text-[30px] absolute top-[30px] left-1/2 -translate-x-1/2">no comments here</div>
                    ) : (
                      <>
                      {
                        comments.slice().reverse().map((comment, index) => (

                        <div key={index} className="w-full min-h-[50px] px-3 pt-2 flex items-start justify-start gap-2">
                    
                          <div className="flex items-center justify-start gap-2">
                            <div onClick={() => redirectToClickProfile(comment.userDet._id)} className="w-[40px] h-[40px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center cursor-pointer">
                              <img
                                src={comment.userDet.avatar === "default-avatar.jpeg" ? `./public/default/${comment.userDet.avatar}` : `${comment.userDet.avatar}`}
                                className="rounded-full border-4 border-black w-[36px] h-[36px]  object-cover object-center"
                                alt=""
                              />
                            </div>
      
                            <div className="pt-2">
                              <h1 onClick={() => redirectToClickProfile(comment.userDet._id)} className="text-white text-[17px] font-semibold cursor-pointer">
                                {comment.userDet.userId}
                              </h1>
                              <h1 className="text-zinc-400 mt-[-5px]">{comment.likeCommentCount} Likes</h1>
                            </div>
                         </div>
      
                          <div className="ml-2 w-full pt-2">
                            <p className="text-zinc-300 text-[16px]">
                              {comment.comment}
                            </p>
                          </div>

                          <div className="w-[50px] h-[30px] flex justify-center items-center">
                            <FaRegHeart onClick={() => likeComment(comment._id, postDetInCommentBox.postId)} className={`${likecomments.indexOf(comment._id) === -1 ? "text-white" : "text-red-500"} cursor-pointer text-[12px]`}/>
                          </div>
      
                        </div>
                        ))
                      }
                      
                      </>
                    )
                  }

              </div>

              <div className="w-full h-[20%] flex flex-col justify-start items-center">
                <div className="w-full h-[60%] border-b-[1px] border-zinc-700 flex flex-col items-start justify-center gap-1 px-3">

                  <div className="flex items-center justify-between w-full">

                      <div className="flex items-center justify-start gap-3">
                        <FaRegHeart onClick={() => (likePosts(postDetInCommentBox.postId, "incommentbox"))} className={`${likeposts.indexOf(postDetInCommentBox.postId) === -1 ? "text-white" : "text-red-600"} hover:scale-[1.1] transition-all text-[25px] cursor-pointer`} />
                        <FaRegCommentAlt onClick={()=> settogglecomment(true)} className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                        <PiShareFatBold className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                      </div>

                      <div>
                      {
                      user._id === postDetInCommentBox.userId ? (
                        <div></div>
                      ) : (
                        <TbLibraryPlus onClick={() => savepost(postDetInCommentBox.postId)} className={`${saveposts.indexOf(postDetInCommentBox.postId) === -1 ? "text-white" : "text-green-600"} text-[25px] cursor-pointer hover:scale-[1.1] transition-all`}/>
                      )
                    }
                      </div>

                  </div>

                  <div className="text-white text-[18px] cursor-pointer font-semibold flex justify-start items-center gap-3">
                  <h1 onClick={() => likeBox(postDetInCommentBox.postId)} >{postDetInCommentBox.likeCount} Likes,</h1> 
                  <h1>{postDetInCommentBox.commentCount} Comments</h1>
                </div>

                </div>

                <div className="w-full h-[40%] rounded-br-[10px]">
                  <form onSubmit={(e) => (e.preventDefault(),doComment(postDetInCommentBox.postId))} action="" className="relative flex items-center justify-between h-full w-full pr-3">
                    <input type="text" value={singleComment} onChange={(e) => setsingleComment(e.target.value)} placeholder="comment here..." className="w-[450px] h-full bg-transparent outline-none text-white text-[18px] px-3 bg-green-500" name="" id="" />
                    <input type="submit" value="comment" className="text-[17px] text-blue-500 cursor-pointer" name="" id="" />
                  </form>
                </div>

              </div>

            </div>

          </div>

      </div>
        )
      }

    </div>
  );
}

export default Feed;
