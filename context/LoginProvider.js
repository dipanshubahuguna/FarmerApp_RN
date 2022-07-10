import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage"
import client from '../api/client';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [userGlobal, setUserGlobal] = useState({})
  const [onBoard, setOnBoard] = useState(false)
  // const [isFirstLaunched, setIsFirstLaunched] = useState(null)


  const fetchUser = async () => {
    console.log('login Provider reached !!')
    const token = await AsyncStorage.getItem('token')
    const farmer_id = await AsyncStorage.getItem('userID')
    console.log("token :", token)
    // console.log("farmer_id :", farmer_id)
    // const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched')

    // if (alreadyLaunched === null) {
    //   AsyncStorage.setItem('alreadyLaunched', 'true')
    //   setIsFirstLaunched(true)
    // } else {
    //   setIsFirstLaunched(false)
    // }

    // console.log("isFirstLaunched: ", isFirstLaunched)


    try {
      if (token !== null) {
        const res = await client.get('/day-selling', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const user_global = await client.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log("user_global-----", user_global.data)
        console.log("user_global kyc-----", user_global.data.kyc)
        console.log("user_global bank-----", user_global.data.bank)
        if (res.data.email !== null) {
          setProfile(res.data.data)
          setUserGlobal(user_global.data)
          // console.log('res.data.user: ',res.data)
          setIsLoggedIn(true)
          if (setIsLoggedIn) {
            if (user_global.data.kyc !== null) {
              setOnBoard(false)
            }
            else{
              setOnBoard(true)
            }
          }
        } else {
          // setProfile({})
          setIsLoggedIn(false)
        }
      } else {
        // setProfile({})
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.log('Error: ', error.message)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile, userGlobal, setUserGlobal, setOnBoard, onBoard }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;