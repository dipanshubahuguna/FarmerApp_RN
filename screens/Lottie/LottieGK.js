import React, { useRef,useEffect } from 'react';
import { View,Dimensions } from 'react-native';

import LottieView from 'lottie-react-native';


const width = Dimensions.get('window').width

const LottieGK = () => {
    
    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    return (
        <View>
            <LottieView
                style={{ height: 90, width: width}}
                source={require('../../assets/15173-farmers-tractor.json')}
                ref={(animation) => {
                    animationRef.current = animation;
                }}
                autoPlay
                loop
            />
        </View>
    )
}

export default LottieGK