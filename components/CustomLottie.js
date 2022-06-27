import React, { useRef,useEffect, useState } from 'react';
import { View} from 'react-native';

import LottieView from 'lottie-react-native';

const CustomLottie = () => {
    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    return (
        <View style={{ backgroundColor: '#fff',height:100,width:200 }}>
            <LottieView
                source={require('../assets/10470-confirm.json')}
                ref={(animation) => {
                    animationRef.current = animation;
                }}
                autoPlay 
                loop
            />
        </View>
    )
}


export default CustomLottie