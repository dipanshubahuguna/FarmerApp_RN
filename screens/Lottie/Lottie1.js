import React, { useRef,useEffect, useState } from 'react';
import { View} from 'react-native';

import LottieView from 'lottie-react-native';

const Lottie1 = ({navigation}) => {
    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    // console.log(route.params.data)


    // const [dataForward,setDataForward] = useState({})

    setTimeout(() => {
        // console.log("identityProof ----",route.params.data.identityProof)
        // console.log("checked ------ ",route.params.data.checked)
        // setDataForward(route.params.data)
        // console.log(dataForward)
        // let dataForward = route.params.data
        navigation.replace('BankDetails');
        }, 1500);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <LottieView
                source={require('../../assets/done.json')}
                ref={(animation) => {
                    animationRef.current = animation;
                }}
                autoPlay
                loop
            />
        </View>
    )
}


export default Lottie1