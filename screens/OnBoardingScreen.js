import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IdentityProof from './IdentityProof';
import BankDetails from './BankDetails';
import ProfileUpload from './ProfileUpload';
import Lottie from './Lottie/Lottie1';
import { AppScreen } from '../MainNavigator';
import Lottie1 from './Lottie/Lottie1';
import Lottie2 from './Lottie/Lottie2';
import Lottie3 from './Lottie/Lottie3';
// import { Modal } from 'react-native-paper';


const Stack = createNativeStackNavigator()

const OnBoardingScreen = ({navigation}) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name='onBoarding' component={OnBoardingScreen} /> */}
        <Stack.Screen name="IdentityProof" component={IdentityProof} />
        <Stack.Screen name="Lottie1" component={Lottie1} />
        <Stack.Screen name="BankDetails" component={BankDetails} />
        <Stack.Screen name="Lottie2" component={Lottie2} />
        <Stack.Screen name="ProfileUpload" component={ProfileUpload} />
        <Stack.Screen name="Lottie3" component={Lottie3} />
        {/* <Stack.Screen name='TabScreen' component={TabScreen} /> */}
        {/* <Stack.Screen {...props} name="MainScreen"  component={MainScreen} />
        <Stack.Screen {...props} name="PriceScreen" component={PriceScreen} /> */}
    </Stack.Navigator>
    )
}


export default OnBoardingScreen