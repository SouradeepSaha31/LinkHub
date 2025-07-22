import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, Routes, RouterProvider} from "react-router-dom"
import Option from "./components/Option/Option.jsx"
import Signup from "./components/Signup/Signup.jsx"
import Login from "./components/Login/Login.jsx"
import Profile from "./components/Profile/Profile.jsx"
import Feed from "./components/Feed/Feed.jsx"
import Search from "./components/Search/Search.jsx"
import CreatePost from "./components/CreatePost/CreatePost.jsx"
import SavePost from "./components/SavePost/SavePost.jsx"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx"
import Editprofile from "./components/Editprofile/Editprofile.jsx"
import ProfileAllPost from "./components/ProfileAllPost/ProfileAllPost.jsx"
import ProfileAllSavePost from "./components/ProfileAllSavePost/ProfileAllSavePost.jsx"
import ShowSearchedProfile from "./components/ShowSearchedProfile/ShowSearchedProfile.jsx"
import SearchProfileAllPost from "./components/SearchProfileAllPost/SearchProfileAllPost.jsx"


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Option />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<App />}>
        <Route path="/profile" element={<ProtectedRoute Component = {Profile}/>} />
        <Route path="/savepost" element={<ProtectedRoute Component = {SavePost}/>} />
        <Route path="/feed" element={<ProtectedRoute Component = {Feed} />} />
        <Route path="/search" element={<ProtectedRoute Component = {Search} />} />
        <Route path="/createpost" element={<ProtectedRoute Component = {CreatePost} />} />
        <Route path="/editprofile" element={<ProtectedRoute Component = {Editprofile} />} />
        <Route path="/profileallpost" element={<ProtectedRoute Component = {ProfileAllPost} />} />
        <Route path="/profileallsavepost" element={<ProtectedRoute Component = {ProfileAllSavePost} />} />
        <Route path="/showsearchedprofile/:user_id" element={<ProtectedRoute Component = {ShowSearchedProfile} />} />
        <Route path="/searchprofileallpost/:user_id" element={<ProtectedRoute Component = {SearchProfileAllPost} />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
