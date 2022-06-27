import React, { useEffect } from 'react';
import { View, Text, ImageBackground, Image, Dimensions,ScrollView } from 'react-native';



const { height, width } = Dimensions.get('window')

const SplashScreen = ({navigation}) => {
    setTimeout(()=>{
        navigation.replace('TabScreen')
    },2000)
    return (
        <ImageBackground style={{ flex: 1 }} source={require('../assets/Background.png')}>
            <View style={{justifyContent: 'center', alignItems: 'center',flexDirection:'column',height:'70%' }}>
                <Image source={require('../assets/logo_150x100.png')} />
                <Image style={{height:500,width:350}} source={require('../assets/Farmer.png')} />
                <Text style={{color:'#000000',fontSize:19}}>Welcome</Text>
            </View>
        </ImageBackground>
    )
}

export default SplashScreen