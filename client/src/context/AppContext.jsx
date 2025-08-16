import { createContext } from "react";
import { useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext() 
export const AppContextProvider = (props)=>{

    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/'; // it gets the backend URL from the environment variables
    const [isLoggedIn, setIsLoggedIn] = useState(false); // to track if the user is logged in
    const [userData, setUserData] = useState(false); // to store user data

    //
    const getUserData=async()=>{
        try {
            const {data} =await axios.get(backendURL +'/api/user/data')
            data.success ? setUserData(data.userData): toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }


    // This context will provide the backend URL, login state, and user data to the entire application
    // so that any component can access it without prop drilling.
    const value={
        backendURL,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData
    }

    // The AppContext.Provider component wraps around the children components
    // and provides the value object to them.
    return (
        <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    )
}