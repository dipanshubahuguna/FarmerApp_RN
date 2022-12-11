import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useLogin } from './context/LoginProvider';
import InUpScreen from './screens/InUpScreen';
import MainScreen from './screens/MainScreen';
import PriceScreen from './screens/PriceScreen';
import SplashScreen from './screens/SplashScreen';
import TabScreen from './screens/TabScreen';
import SplashScreenLogin from './screens/SplashScreenLogin';
import OnBoardingScreen from './screens/OnBoardingScreen';
import IdentityProof from './screens/IdentityProof';
import Lottie1 from './screens/Lottie/Lottie1';
import BankDetails from './screens/BankDetails';
import ProfileUpload from './screens/ProfileUpload';
import Lottie2 from './screens/Lottie/Lottie2';
import Lottie3 from './screens/Lottie/Lottie3';
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneAuth from './screens/PhoneAuth';
import client from './api/client';
import ForgotPassword from './screens/ForgotPassword';



const Stack = createNativeStackNavigator();

const FormScreen = (props) => {

    // console.log('props           :' ,props)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='SplashScreenLogin' component={SplashScreenLogin} />
            <Stack.Screen name="InUpScreen" component={InUpScreen} />
            <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen {...props} name="AppScreen" component={AppScreen} />
        </Stack.Navigator>

    )
}
const AppScreen = (props) => {


    // const { isLoggedIn,setIsLoggedIn, onBoard, isFirstLaunched, setIsFirstLaunched } = useLogin()

    // setIsLoggedIn(true)

    // console.log('props           :' ,props)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name='onBoarding' component={OnBoardingScreen} /> */}
            <Stack.Screen name="IdentityProof" component={IdentityProof} />
            <Stack.Screen name="Lottie1" component={Lottie1} />
            <Stack.Screen name="BankDetails" component={BankDetails} />
            <Stack.Screen name="Lottie2" component={Lottie2} />
            <Stack.Screen name="ProfileUpload" component={ProfileUpload} />
            <Stack.Screen name="Lottie3" component={Lottie3} />
            <Stack.Screen name='TabScreen' component={TabScreen} />
            {/* <Stack.Screen {...props} name="MainScreen"  component={MainScreen} />
            <Stack.Screen {...props} name="PriceScreen" component={PriceScreen} /> */}
        </Stack.Navigator>

    )
}

const MainApp = () => {

    // const { isLoggedIn,setIsLoggedIn, onBoard, isFirstLaunched, setIsFirstLaunched } = useLogin()

    // setIsLoggedIn(true)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabScreen" component={TabScreen} />
        </Stack.Navigator>
    )
}

const MainNavigator = (props) => {

    const [Res,setRes] = useState('')

    const { isLoggedIn, onBoard, isFirstLaunched, setIsFirstLaunched,setOnBoard } = useLogin()

    const fetchApi = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const farmer_id = await AsyncStorage.getItem('userID')
            console.log("token :", token)
    
            const res = client.get('/user',{
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            })
            console.log(res.data)
            setRes(res.data)
            
        } catch (error) {
            console.log(error)
        }
    }

    // useEffect(() =>{
    //     fetchApi()
    //   })

    // console.log('props           :' ,props)
    console.log('isLoggedIn :', isLoggedIn)
    // if(onBoard) setIsFirstLaunched(true)
    // else if(onBoard === false) setIsFirstLaunched(false)
    console.log('OnBoard :', onBoard)
    console.log('isFirstLaunched :', isFirstLaunched)

    // if(Res.data){
    //     if(Res.data.bank == null) setOnBoard(true)
    //     if(Res.data.bank != null) setOnBoard(false)
    // }


    // return <AppScreen/>

    if (isLoggedIn) {
        if (onBoard) {
            return (
                <AppScreen />
            )
        } else {
            return <MainApp />
        }
    } else {
        return <FormScreen />
    }

    // return isLoggedIn ? <AppScreen /> : <FormScreen />
}

export default MainNavigator
