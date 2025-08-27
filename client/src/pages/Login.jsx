import React, { useContext } from 'react' //
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext' //
import axios from 'axios' // imports axios for making HTTP requests
import { toast } from 'react-toastify';


const Login = () => {
  const navigate = useNavigate() // allows navigation to different routes in the application
  const {backendURL,setIsLoggedIn ,getUserData} = useContext(AppContext) // imports the backend URL and the setIsLoggedin function from the AppContext


  const [state,setState] = useState('Sign Up')
  const [username,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {

      e.preventDefault(); // stops browser from reloading the page when submit button is clicked

      axios.defaults.withCredentials = true; // allows cookies to be sent with requests
      
      if(state === 'Sign Up'){
        const {data} = await axios.post(backendURL + '/api/auth/register',{username,email,password}) // sends a POST request to the backend to register a new user
        if(data.success){
          setIsLoggedIn(true) // updates the context to reflect that the user is logged in
          getUserData()
          navigate('/')  // redirects to the home page
          toast.success(data.message) // shows a success message if registration is successful
        }else{
          toast.error(data.message) // shows an error message if registration fails
        }
      }else{
        const {data} = await axios.post(backendURL + '/api/auth/login',{email,password}) // sends a POST request to the backend to register a new user

        if(data.success){
          setIsLoggedIn(true) // updates the context to reflect that the user is logged in
          getUserData()
          navigate('/')  // redirects to the home page
          toast.success(data.message)
        }else{
          toast.error(data.message) // shows an error message if login fails
        }
      } 
    }
    catch (error) {
      toast.error(error.message)
    }
  }
  

  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>


      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        { state === 'Sign Up' ? (
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.person_icon}/>
          <input
          onChange={e=>setName(e.target.value)}
          value={username}
          className='bg-transparent outline-none ' type="text" placeholder='Full Name' required/>
        </div> )
        :(null)
        }

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon}/>
          <input 
          onChange={e=>setEmail(e.target.value)}
          value={email}
          className='bg-transparent text-white outline-none' type="email" placeholder='Email id' required/>
        </div>

        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.lock_icon}/>
          <input
          onChange={e=>setPassword(e.target.value)}
          value={password}
          className='bg-transparent outline-none ' type="password" placeholder='password' required/>
        </div>
        <p onClick={()=>navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot password</p>

        <button type='submit' className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
      </form>
      { state === 'Sign Up' ?(
      <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
        <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
      </p>
      ):(
      <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
        <span onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign up</span>
      </p>
      )}
  </div>
    </div>
  )
}

export default Login