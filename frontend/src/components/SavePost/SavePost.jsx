import React, {useEffect, useRef, useState} from 'react'
import {Link, NavLink, useNavigate} from "react-router-dom"
import path from "path-browserify"
import axios from "axios"
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { PiShareFatBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { TbLibraryPlus } from "react-icons/tb";
import Swal from 'sweetalert2'





function SavePost() {
  const [data, setdata] = useState([])
  const [data2, setdata2] = useState([])
  const [scrollPosition, setScrollPosition] = useState(0);
  const [followers, setfollowers] = useState(0)
  const [followings, setfollowings] = useState(0)
  const [likeCompleted, setlikeCompleted] = useState(false)
  const [postDetInCommentBox, setpostDetInCommentBox] = useState(null)
  const [comments, setcomments] = useState([])
  const [singleComment, setsingleComment] = useState("")
  const [togglecomment, settogglecomment] = useState(false)
  const [toggleLikeBox, settoggleLikeBox] = useState(false)
  const [userWhoAreLike, setuserWhoAreLike] = useState(null)
  const [toggleFollowersBox, settoggleFollowersBox] = useState(false)
  const [userWhoAreFollowers, setuserWhoAreFollowers] = useState(null)
  const [toggleFollowingsBox, settoggleFollowingsBox] = useState(false)
  const [userWhoAreFollowings, setuserWhoAreFollowings] = useState(null)

  let likeposts = JSON.parse(localStorage.getItem("likeposts"))
  let following = JSON.parse(localStorage.getItem("following"))
  let likecomments = JSON.parse(localStorage.getItem("likecomments"))
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()


  const saveScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };
  
  const restoreScrollPosition = () => {
    console.log(scrollPosition)
    window.scrollTo(0,scrollPosition);
  };
  // handle scrolling ==============================================================================
  const handleScrolling = () => {
    settogglecomment(false)
    
    restoreScrollPosition()
  }
  //==================================================================================================


    // follow show --------------------------------------------------------------------------------------
    useEffect(() => {
      const fetchdata = async () => {
        try {
    
          const response = await axios.get("/api/v1/follow/followshowinprofile")
  
          console.log(response.data)
  
          setfollowers(response.data.followers)
          setfollowings(response.data.following)
          
        } catch (error) {
          console.log("error in follow show in ShowSearchProfile.jsx")
          console.log(error)
        }
      }
      fetchdata()
    }, [likeCompleted])
    //-------------------------------------------------------------------------------------------------


  //get request------------------------------------------------------------------------------------------
  useEffect(() => {

    const fetchdata = async () => {
      try {

        const response = await axios.get("/api/v1/savepost/showpostsave")
        setdata(response.data)
        console.log(data)

        const response2 = await axios.get("/api/v1/ownerpost/showpostinprofile")
        setdata2(response2.data)
        
      } catch (error) {
        console.log(error)
      }
    }
    
    fetchdata()
  },[likeCompleted])
  
  //----------------------------------------------------------------------------------------------------

  //unsavepost-----------------------------------------------------------------------------------------
  const unsavepost = async (postid) => {
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

        try {

          const response = await axios.post(`/api/v1/savepost/unsavepost/${postid}`)
          localStorage.setItem("saveposts", JSON.stringify(response.data.saveposts))

          settogglecomment(false)

          setlikeCompleted(!likeCompleted)
        
          navigate("/savepost")
          
        } catch (error) {
          console.log("error in deletepost function in ProfileAllPost file")
          console.log(error)
        }
        
      } else {
        settogglecomment(true)
        navigate("/savepost")
      }
    })
  }
  //---------------------------------------------------------------------------------------------------


  // likeposts -------------------------------------------------------------------------------------

  const likePosts = async (postId) => {
    try {

      const response = await axios.post(`/api/v1/likepost/like/${postId}`)

      localStorage.setItem("likeposts", JSON.stringify(response.data.likeposts))

      setlikeCompleted(!likeCompleted)

      CommentShow(postId)

      navigate("/savepost")

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

    setlikeCompleted(!likeCompleted)

    navigate(`/savepost`)
    
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


// followersBox -----------------------------------------------------------------------------------------
const followersBox = async (userId) => {
  try {

    console.log(userId)

    const response = await axios.post(`/api/v1/follow/followersbox/${userId}`)

    console.log(response.data)

    setuserWhoAreFollowers(response.data)

    settoggleFollowersBox(true)
    
  } catch (error) {
    console.log("error in followersBox function in feed.jsx")
    console.log(error)
  }
}
//-------------------------------------------------------------------------------------------------

// followingsBox -----------------------------------------------------------------------------------
const followingsBox = async (userId) => {
  try {

    console.log(userId)

    const response = await axios.post(`/api/v1/follow/followingsbox/${userId}`)

    console.log(response.data)

    setuserWhoAreFollowings(response.data)

    settoggleFollowingsBox(true)
    
  } catch (error) {
    console.log("error in followingsBox function in feed.jsx")
    console.log(error)
  }
}
//-------------------------------------------------------------------------------------------------

// unFollow------------------------------------------------------------------------------------------
const unFollow = async (userid) => {
  try {

    const response = await axios.post(`/api/v1/follow/unfollow/${userid}`)

    localStorage.setItem("following", JSON.stringify(response.data.following))

    followingsBox(user._id)

    setlikeCompleted(!likeCompleted)
    
  } catch (error) {
    console.log("error in unFollow function in profile.jsx")
    console.log(error)
  }
}
//----------------------------------------------------------------------------------------------------

// removeFollower----------------------------------------------------------------------------------------
const removeFollower = async (userid) => {
  try {

    const response = await axios.post(`/api/v1/follow/removefollower/${userid}`)

    followersBox(user._id)

    setlikeCompleted(!likeCompleted)
    
  } catch (error) {
    console.log("error in unFollow function in profile.jsx")
    console.log(error)
  }
}
//----------------------------------------------------------------------------------------------------

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
      <div className='w-full min-h-screen bg-black flex justify-start items-center'>
        <div className='min-h-screen w-1/5'></div>
  
        <div className='min-h-screen w-4/5 px-10 py-5'>
  
          <div className='w-full mb-5 h-[200px] rounded-[20px] overflow-hidden'>
            <img src= {user.coverImage == "cover-default.jpg" ? `./public/default/${user.coverImage}` : `${user.coverImage}`} className='w-full h-full object-cover object-center' alt="" />
          </div>
  
          <div className='w-full h-[200px] flex'>
            <div className='w-1/5 h-full flex justify-center items-center'>
              <div className='w-[180px] h-[180px] rounded-full flex justify-center items-center bg-gradient-to-r from-yellow-400 to-red-700'>
                <img src= {user.avatar == "default-avatar.jpeg" ? `./public/default/${user.avatar}` : `${user.avatar}`} className='w-[175px] h-[175px] rounded-full border-4 border-black object-cover object-center' alt="" />
              </div>
            </div>
  
            <div className='w-4/5 h-full flex'>
              <div className='w-1/2 h-full flex flex-col px-5 py-1 items-start gap-1 justify-start'>
                <div className='flex items-center justify-start gap-4'>
                  <h1 className='text-white text-[30px] font-bold'>{user.userId}</h1>
                </div>
                <h1 className='text-zinc-500 text-[17px]'>{user.fullname}</h1>
                <p className='text-zinc-300 text-[17px] tracking-tighter leading-5 mt-[7px]'>{user.bio}</p>
              </div>
              <div className='w-1/2 h-full flex items-start justify-end gap-4'>
                <div className='min-w-[50px] h-[50px] flex flex-col justify-center items-center'>
                  <h1 className='text-white text-[20px] font-semibold'>{data2.length}</h1>
                  <h1 className='text-white text-[17px]'>Posts</h1>
                </div>
                <div onClick={() => followersBox(user._id)} className='min-w-[50px] cursor-pointer h-[50px] flex flex-col justify-center items-center'>
                  <h1 className='text-white text-[20px] font-semibold'>{followers}</h1>
                  <h1 className='text-white text-[17px]'>Followers</h1>
                </div>
                <div onClick={() => followingsBox(user._id)} className='min-w-[50px] h-[50px] cursor-pointer flex flex-col justify-center items-center'>
                  <h1 className='text-white text-[20px] font-semibold'>{followings}</h1>
                  <h1 className='text-white text-[17px]'>Following</h1>
                </div>
              </div>
            </div>
  
          </div>
  
          <div className='w-full min-h-[180px] mt-[40px] relative'>
  
            <div className='w-full mb-5 h-[40px] flex justify-center border-t-[1px] border-zinc-700 items-center gap-2'>
              <NavLink to="/profile" className= {({isActive}) => `${isActive ? "border-zinc-100 text-white" : "border-black text-zinc-500"} h-full w-[100px] text-[15px] font-semibold border-b flex justify-center items-center`}>Post</NavLink>
              <NavLink to="/savepost" className= {({isActive}) => `${isActive ? "border-zinc-100 text-white" : "border-black text-zinc-500"} h-full w-[100px] text-[15px] font-semibold border-b flex justify-center items-center`}>Save</NavLink>
            </div>
  
            <div className={`w-full min-h-[250px] flex ${data.length === 0 ? "justify-center" : "justify-start"} items-center flex-wrap gap-1`}>

              {
                data.length === 0 ? (
                  <h1 className='text-green-500 text-[20px] font-semibold'>no saved post yet</h1>

                ) : (
                  <>
                      {
                data.slice().reverse().map((post, index) => (

                path.extname(post.postDet.file) === ".jpg" || path.extname(post.postDet.file) === ".jpeg" || path.extname(post.postDet.file) === ".png" ? (

                  <Link onClick={()=> CommentShow(post.postId)} key={index} className='cursor-pointer w-[330px] h-[330px] overflow-hidden relative group'>
                    <div className='w-full h-full bg-zinc-900 opacity-[0.5] group-hover:block hidden absolute top-0 left-0 z-[2]'>
                      <div className='flex justify-center items-center gap-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <div className='flex justify-center items-center gap-2'>
                          <div className='text-white text-[25px]'>{post.likeCount}</div>
                          <FaRegHeart className="text-white text-[25px] cursor-pointer" />
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                          <div className='text-white text-[25px]'>{post.commentCount}</div>
                          <FaRegCommentAlt className="text-white text-[25px] cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    <img src= {post.postDet.file} className='w-full h-full object-cover object-center absolute top-0 left-0 z-[1]' alt="" />
                  </Link>

                ) : ( 

                  <Link onClick={()=> CommentShow(post.postId)} key={index} className='w-[330px] h-[330px] overflow-hidden cursor-pointer relative group'>
                    <div className='w-full h-full bg-zinc-900 opacity-[0.5] group-hover:block hidden absolute top-0 left-0 z-[2]'>
                      <div className='flex justify-center items-center gap-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <div className='flex justify-center items-center gap-2'>
                          <div className='text-white text-[25px]'>{post.likeCount}</div>
                          <FaRegHeart className="text-white text-[25px] cursor-pointer" />
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                          <div className='text-white text-[25px]'>{post.commentCount}</div>
                          <FaRegCommentAlt className="text-white text-[25px] cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    <video src= {post.postDet.file} className='w-full h-full object-cover object-center'></video>
                  </Link>
    
                )
              ))
            } 
                  </>
                )
              }
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
        userWhoAreFollowers === null ? (
          <></>
        ) : (

          <div className={`w-full h-screen bg-[#00000095] fixed top-0 left-0 z-[300] ${toggleFollowersBox ? "flex" : "hidden"} justify-center items-center`}>

          <div className="w-[400px] h-[400px] bg-zinc-900 rounded-[15px] overflow-hidden flex flex-col justify-center items-center">
  
              <div className="w-full h-[10%] relative border-b-[1px] border-zinc-700 flex justify-center items-center">
                  <h1 className="text-white font-semibold text-[17px]">Followers</h1>
                  <RxCross2 onClick={() => settoggleFollowersBox(false)} className="text-white absolute top-[7px] right-[7px] cursor-pointer text-[25px]"/>
              </div>
  
              <div className="your-box w-full h-[90%] overflow-y-auto py-1 relative">

                {
                  userWhoAreFollowers.length === 0 ? (
                    <>
                    <h1 className='text-green-500 text-[19px] font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>0 Followers</h1>
                    </>
                  ) : (
                    <>
                          {
                  userWhoAreFollowers.slice().reverse().map((followers, index) => (
  
                    <div key={index} className="w-full h-[60px] flex items-center justify-between px-3">
                    <div className="h-full flex justify-center items-center gap-2">

                          <div onClick={() => redirectToClickProfile(followers.followersDet._id)} className="w-[50px] h-[50px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center cursor-pointer">

                              <img src={followers.followersDet.avatar === "default-avatar.jpeg" ? `./public/default/${followers.followersDet.avatar}` : `${followers.followersDet.avatar}`} alt="" className="w-[46px] h-[46px] border-4 border-black rounded-full"/>

                          </div>

                          <h1 onClick={() => redirectToClickProfile(followers.followersDet._id)} className="text-white text-[17px] font-semibold cursor-pointer">
                              {followers.followersDet.userId}
                          </h1>

                    </div>
                    <div onClick={() => removeFollower(followers.followersDet._id)} className="bg-zinc-800 text-zinc-500 text-[17px] font-semibold px-3 py-1 rounded-[10px] cursor-pointer">
                        Remove
                    </div>
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
        userWhoAreFollowings === null ? (
          <></>
        ) : (

          <div className={`w-full h-screen bg-[#00000095] fixed top-0 left-0 z-[300] ${toggleFollowingsBox ? "flex" : "hidden"} justify-center items-center`}>

          <div className="w-[400px] h-[400px] bg-zinc-900 rounded-[15px] overflow-hidden flex flex-col justify-center items-center">
  
              <div className="w-full h-[10%] relative border-b-[1px] border-zinc-700 flex justify-center items-center">
                  <h1 className="text-white font-semibold text-[17px]">Followings</h1>
                  <RxCross2 onClick={() => settoggleFollowingsBox(false)} className="text-white absolute top-[7px] right-[7px] cursor-pointer text-[25px]"/>
              </div>
  
              <div className="your-box w-full h-[90%] overflow-y-auto py-1 relative">

                {
                  userWhoAreFollowings.length === 0 ? (
                    <>
                    <h1 className='text-green-500 text-[19px] font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>0 Followings</h1>
                    </>
                  ) : (
                    <>
                          {
                  userWhoAreFollowings.slice().reverse().map((followings, index) => (
  
                    <div key={index} className="w-full h-[60px] flex items-center justify-between px-3">
                    <div className="h-full flex justify-center items-center gap-2">

                          <div onClick={() => redirectToClickProfile(followings.followingsDet._id)} className="w-[50px] h-[50px] bg-gradient-to-r from-yellow-400 to-red-700 rounded-full flex justify-center items-center cursor-pointer">

                              <img src={followings.followingsDet.avatar === "default-avatar.jpeg" ? `./public/default/${followings.followingsDet.avatar}` : `${followings.followingsDet.avatar}`} alt="" className="w-[46px] h-[46px] border-4 border-black rounded-full"/>

                          </div>

                          <h1 onClick={() => redirectToClickProfile(followings.followingsDet._id)} className="text-white text-[17px] font-semibold cursor-pointer">
                              {followings.followingsDet.userId}
                          </h1>

                    </div>
                    <div onClick={() => unFollow(followings.followingsDet._id)} className="bg-zinc-800 text-zinc-500 text-[17px] cursor-pointer font-semibold px-3 py-1 rounded-[10px]">
                        Following
                    </div>
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
                <h1 onClick={() => follow(postDetInCommentBox.ownerDet._id)} className="text-blue-500 text-[16px] cursor-pointer">
                  {following.indexOf(postDetInCommentBox.ownerDet._id) === -1 ? "Follow" : "Following"}
                </h1>
              </div>

              <div className="your-box w-full h-[70%] border-b-[1px] overflow-y-auto overflow-x-auto relative border-zinc-700">

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
                        <FaRegHeart onClick={() => (likePosts(postDetInCommentBox.postId))} className={`${likeposts.indexOf(postDetInCommentBox.postId) === -1 ? "text-white" : "text-red-600"} hover:scale-[1.1] transition-all text-[25px] cursor-pointer`} />
                        <FaRegCommentAlt onClick={()=> settogglecomment(true)} className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                        <PiShareFatBold className="text-white hover:scale-[1.1] transition-all text-[25px] cursor-pointer" />
                      </div>

                      <div>
                      <TbLibraryPlus onClick={() => unsavepost(postDetInCommentBox.postId)} className="text-green-600 text-[25px] cursor-pointer"/>
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
  
    )
}

export default SavePost