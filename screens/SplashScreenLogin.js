import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, Image, Dimensions, ScrollView } from 'react-native';

import LottieView from 'lottie-react-native';
import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';


const { height, width } = Dimensions.get('window')

const SplashScreenLogin = ({ navigation }) => {

    const { t, i18n } = useTranslation()

    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    setTimeout(()=>{
        navigation.replace('InUpScreen')
    },2000)
    
    return (
        <ImageBackground style={{ flex: 1,backgroundColor:'#fff' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Image source={require('../assets/logo_150x100.png')} />
                <Image style={{ height: 400, width: 350 }} source={require('../assets/Slide1.jpg')} />
                <Text style={{color:'#000000',fontSize:19,fontFamily:'Montserrat Bold'}}>{t('common:splashScreen.welcome')}</Text>
                <Text style={{color:'#000000',fontSize:15,fontFamily:'Montserrat SemiBold'}}>{t('common:splashScreen.content')}</Text>
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