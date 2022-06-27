import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, Image, Dimensions, ScrollView } from 'react-native';

import LottieView from 'lottie-react-native';


const { height, width } = Dimensions.get('window')

const SplashScreenLogin = ({ navigation }) => {

    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    setTimeout(()=>{
        navigation.replace('InUpScreen')
    },2000)
    
    return (
        <ImageBackground style={{ flex: 1 }} source={require('../assets/Background.png')}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Image source={require('../assets/logo_150x100.png')} />
                <Image style={{ height: 400, width: 350 }} source={require('../assets/Slide1.jpg')} />
                <Text style={{color:'#000000',fontSize:19}}>Welcome</Text>
                <Text style={{color:'#000000',fontSize:15}}>Hello! Amazing deals are just a sign-up away.</Text>
                <LottieView
                    style={{height:80,width:80}}
                    source={require('../assets/99947-loader.json')}
                    ref={(animation) => {
                        animationRef.current = animation;
                    }}
                    autoPlay
                    loop
                />
            </View>
        </ImageBackground>
    )
}

export default SplashScreenLogin