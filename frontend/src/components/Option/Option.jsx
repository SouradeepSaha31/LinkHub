import React from 'react'
import "./Option.css"
import { Link } from 'react-router-dom'

function Option() {
  return (
    <div className='w-full min-h-screen bg-black flex items-center justify-center'>

      <div className='w-[400px] h-[230px] gap-4 flex flex-col px-[50px] py-[15px] justify-start items-center rounded-[10px]'>

        <h1 className='pacifico-regular text-white text-[40px]'>LinkHub</h1>

        <Link to='/signup' className='w-full h-[50px] text-white bg-yellow-700 rounded-[10px] mt-3 cursor-pointer flex items-center justify-center text-[20px]'>Create New Account</Link>

        <Link to='/login' className='text-blue-400 text-[20px]'>Login</Link>

      </div>

    </div>
  )
}

export default Option