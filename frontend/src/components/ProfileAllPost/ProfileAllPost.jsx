import React, { useRef, useEffect, useState } from 'react'
import "./ProfileAllPost.css"
import {useNavigate} from "react-router-dom"
import axios from 'axios';
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import path from "path-browserify"

import Swal from 'sweetalert2'

function ProfileAllPost() {

  const [data, setdata] = useState([])
  const [likeCompleted, setlikeCompleted] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0);
  const [postDetInCommentBox, setpostDetInCommentBox] = useState(null)
  const [comments, setcomments] = useState([])
  const [singleComment, setsingleComment] = useState("")
  const [togglecomment, settogglecomment] = useState(false)

  
  let likeposts = JSON.parse(localStorage.getItem("likeposts"))
  const navigate = useNavigate()

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

      navigate("/profileallpost")

    } catch (error) {
      console.log(error)
    }
  }

  //-----------------------------------------------------------------------------------------------

  

  //useeffect------------------------------------------------------------------------------------------
    useEffect(() => {

        const fetchdata = async () => {
          try {

            const response = await axios.get("/api/v1/ownerpost/showloggedinuserpost")
            setdata(response.data)
            restoreScrollPosition();
        
          } catch (error) {
            console.log(error)
          }
        }
    
    fetchdata()
  },[likeCompleted])
  //----------------------------------------------------------------------------------------------------

// CommentShow ----------------------------------------------------------------------------------------
const CommentShow = async (postId) => {
  try {

    console.log(postId)

    const response = await axios.post(`/api/v1/comment/commentshow/${postId}`)
    console.log(response.data)
    setpostDetInCommentBox(response.data.findOwner)
    setcomments(response.data.findComment)
    settogglecomment(true)
    
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


  //deletepost------------------------------------------------------------------------------------------
  const deletepost = async (postid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: "red",
      background: "black",
      className: "custom-sweetalert",
      showConfirmButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: "green",
      showDenyButton: true,
      denyButtonText: "Cancel",
      denyButtonColor: "red",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    }).then(async (result) => {
      if (result.isConfirmed) {

        // try {

        //   const response = await axios.post(`/api/v1/post/deleteloggedinuserpost/${postid}`)
        //   localStorage.setItem("normaluser", JSON.stringify(response.data.normaluser))
        //   localStorage.setItem("populateduser", JSON.stringify(response.data.populateduser))
        //   navigate("/profile")
          
        // } catch (error) {
        //   console.log("error in deletepost function in ProfileAllPost file")
        //   console.log(error)
        // }
        
      } else {
        navigate("/profileallpost")
      }
    })
  }
  //---------------------------------------------------------------------------------------------------

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
                    src= {post.userDet.avatar === "default-avatar.jpeg" ? `./public/default/${post.userDet.avatar}` : `${post.userDet.avatar}`}
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
                  <FaRegCommentAlt onClick={()=> CommentShow(post.postId)} className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                  <PiShareFatBold className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                  </div>
                  <div>
                  <RiDeleteBin4Fill onClick={() => deletepost(post.postId)} className="text-red-600 text-[25px] cursor-pointer"/>
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

        {
        postDetInCommentBox === null ? (
          <div></div>
        ) : (
          <div className={`w-full h-screen z-[200] fixed top-0 left-0 bg-[#00000095] ${togglecomment ? "flex" : "hidden"} justify-center items-center`}>
          <RxCross2 onClick={()=> settogglecomment(false)} className="text-white absolute top-[10px] right-[10px] cursor-pointer text-[30px]"/>

          <div className="w-[900px] h-[600px] flex">

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

              <div className="w-full h-[10%] px-3 border-b-[1px] border-zinc-800 flex items-center justify-start gap-2">
                <div className="w-[40px] h-[40px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center">
                  <img
                    src={postDetInCommentBox.ownerDet.avatar === "default-avatar.jpeg" ? `./public/default/${postDetInCommentBox.ownerDet.avatar}` : `${postDetInCommentBox.ownerDet.avatar}`}
                    className="rounded-full border-4 border-black w-[36px] h-[36px]  object-cover object-center"
                    alt=""
                  />
                </div>
                <h1 className="text-white text-[18px] font-semibold">
                {postDetInCommentBox.ownerDet.userId}
                </h1>
              </div>

              <div className="your-box w-full h-[70%] border-b-[1px] overflow-y-auto relative border-zinc-800">

                  {
                    comments.length === 0 ? (
                      <div className="text-white font-semibold text-[30px] absolute top-[30px] left-1/2 -translate-x-1/2">no comments here</div>
                    ) : (
                      <>
                      {
                        comments.slice().reverse().map((comment, index) => (

                          <div key={index} className="w-full min-h-[50px] px-3 pt-2 flex items-start justify-start gap-2">
                    
                          <div className="flex items-center justify-start gap-2">
                            <div className="w-[40px] h-[40px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center">
                              <img
                                src={comment.userDet.avatar === "default-avatar.jpeg" ? `./public/default/${comment.userDet.avatar}` : `${comment.userDet.avatar}`}
                                className="rounded-full border-4 border-black w-[36px] h-[36px]  object-cover object-center"
                                alt=""
                              />
                            </div>
      
                            <h1 className="text-white text-[17px] font-semibold">
                              {comment.userDet.userId}
                            </h1>
                         </div>
      
                          <div className="ml-2 w-full pt-2">
                            <p className="text-zinc-300 text-[16px]">
                              {comment.comment}
                            </p>
                          </div>
      
                        </div>
                        ))
                      }
                      
                      </>
                    )
                  }

              </div>

              <div className="w-full h-[20%] flex flex-col justify-start items-center">
                <div className="w-full h-[60%] border-b-[1px] border-zinc-800 flex flex-col items-start justify-center gap-1 px-3">

                  <div className="flex items-center justify-between w-full">

                      <div className="flex items-center justify-start gap-3">
                        <FaRegHeart onClick={() => (likePosts(postDetInCommentBox.postId), CommentShow(postDetInCommentBox.postId))} className={`${likeposts.indexOf(postDetInCommentBox.postId) === -1 ? "text-white" : "text-red-600"} hover:scale-[1.1] transition-all text-[25px] cursor-pointer`} />
                        <FaRegCommentAlt onClick={()=> settogglecomment(true)} className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                        <PiShareFatBold className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                      </div>

                      <div>
                      <RiDeleteBin4Fill onClick={() => deletepost(postDetInCommentBox.postId)} className="text-red-600 text-[25px] cursor-pointer"/>
                      </div>

                  </div>

                  <h1 className="text-white text-[18px] font-semibold">
                    {postDetInCommentBox.likeCount} Likes
                  </h1>

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
  )
}

export default ProfileAllPost