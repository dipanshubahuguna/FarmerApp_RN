import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"

import LottieView from 'lottie-react-native';
import client from '../../api/client';
import axios from 'axios';

const Lottie2 = ({ navigation, route }) => {
    const animationRef = useRef()

    // let ac_ifsc = route.params.data.code
    // let ac_holder= route.params.data.name
    // let ac_number= route.params.data.number
    // const bank_name = 'kotak'


    const postBankDetails = async () => {

        const farmer_id = await AsyncStorage.getItem('userId')
        const token = await AsyncStorage.getItem('token')
        const bank_details = {
            farmer_id: farmer_id,
            bank_name: route.params.data.bankName,
            ac_number: route.params.data.number,
            ac_holder: route.params.data.name,
            ac_ifsc: route.params.data.code

        }
        // console.log("farmer_id,token in lottie2 ---- ",farmer_id,token)
        try {
            const bank = await axios.post('http://printrly.com/public/api/bank-detail', bank_details,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
            console.log("bank", bank.data)
        } catch (error) {
            console.log("error ---- ", error)
        }
    }


    useEffect(() => {
        console.log("route.params.data in lottie2", route.params.data)
        postBankDetails()
        animationRef.current?.play();
    }, []);

    setTimeout(() => {
        let dataNext = route.params.data
        navigation.replace('ProfileUpload');
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


export default Lottie2