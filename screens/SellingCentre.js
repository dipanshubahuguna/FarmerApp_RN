import React, { Component } from 'react';
import { View,Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IdentityProof from './IdentityProof';
import KYCDetails from './BankDetails';
// import KYCupload from './KYCupload';
import MainScreen from './MainScreen';
import PriceScreen from './PriceScreen';
import Profile from './Profile';
import SplashScreen from './SplashScreen';
import DrawerSlide from './DrawerSlide';
import LottiePrice from './Lottie/LottiePrice';

const Stack = createNativeStackNavigator()


const SellingCentre = ({navigation}) =>{
    return(
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="PriceScreen" component={PriceScreen} />
            <Stack.Screen name="LottiePrice" component={LottiePrice} />
        </Stack.Navigator>
    )
}


export default SellingCentre