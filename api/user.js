import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { useLogin } from "../context/LoginProvider"
import client from "./client"
export const signIn = async ({ email, password }) => {

    // const {onBoard,setOnBoard} = useLogin()

    const signInRes = await axios.post('http://printrly.com/public/api/login', { email, password })
    // console.log(signInRes.data.token)
    console.log("signinres in user.js: ----- ", signInRes.data)
    // console.log("signInRes.data.user.status",signInRes.data.user.status)
    // console.log("signInRes -- here! :",signInRes.data.message)
    // console.log("onBoard ---- ",onBoard)
    if (signInRes.data.message === 'Success') {
        const token = signInRes.data.token
        console.log("token--- ",signInRes.data.token)
        console.log("id--- ",signInRes.data.user.id.toString())
        
        const user_log = await client.get('/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem('userId',signInRes.data.user.id.toString())
  
          console.log("user_log-----", user_log.data)
          console.log("user_log kyc-----", user_log.data.kyc)
          console.log("user_log bank-----", user_log.data.bank)
    }
    try {
        return signInRes.data
    } catch (error) {
        console.log('error inside signIn method', error.message)
    }
}


export const signOut = async () => {
    console.log('Reached Sign out!')
    const token = await AsyncStorage.getItem('token');
    // await AsyncStorage.removeItem('token');
    console.log('token in signout : ', token)
    try {
        console.log('reached signOut try block ----')
        const res = await fetch('http://printrly.com/public/api/logout', {
            method:'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        console.log("res signOut:", res.ok)
        // console.log("res.data", res.data)

        if (res.ok) {
            await AsyncStorage.removeItem('token')
            return true
        }
        return false

    } catch (error) {
        // await AsyncStorage.removeItem('token')
        // await AsyncStorage.removeItem('userId')
        console.log('Error block executed but signOut done', error.message)
        // return true
        return false
    }
}


// export const priceCalc = async (price,amount) =>{
//     const res = await client.post('/price',{price,amount})

//     console.log('success :',res.data)

//     if(!res.data.success){
//         return false
//     }

//     return true
// }
