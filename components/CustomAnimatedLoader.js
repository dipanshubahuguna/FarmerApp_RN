import React, { useRef,useEffect } from 'react';
import { View } from 'react-native';

import LottieView from 'lottie-react-native';

const CUstomAnimatedLoader = () => {
    
    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    return (
        <View>
            <LottieView
                style={{ height: 100, width: 100, alignSelf: 'center'}}
                source={require('../assets/lf30_editor_6jvza7e2.json')}
                ref={(animation) => {
                    animationRef.current = animation;
                }}
                autoPlay
                loop
            />
        </View>
    )
}

export default CUstomAnimatedLoader