import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Dimensions, TouchableOpacity, Linking } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage"
import client from '../api/client';
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';


const { height, width } = Dimensions.get('window')


const HelpAndFeedBackScreen = ({ navigation }) => {


    const [info, setInfo] = useState('')

    const email = 'info.sharpessentials@gmail.com' 

    const fetchInfo = async () => {
        const token = await AsyncStorage.getItem('token')
        try {
            const res = await client.get('/about-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("res.data", res.data.message)
            if (res.data.message == 'success') {
                setInfo(res.data.data)
            }
            console.log("info ", info)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInfo()
    }, [])

    return (
        <ImageBackground style={{ flex: 1, backgroundColor: '#fff' }}>
            <CustomHeader navigation={navigation} />
            <ScrollView>
                {
                    info
                        ?
                        <View style={{ alignSelf: 'center', width: width - 40, marginBottom: 300 }} >
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Montserrat Bold' }} >
                                    {info.title}
                                </Text>
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Montserrat Regular' }} >
                                    {info.description}
                                </Text>
                            </View>
                            <View style={{ paddingTop: 40 }}>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`mailto:${email}`)}
                                    style={{ width: width / 3, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Montserrat Bold' }} >
                                        Need Help ?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <>
                            <CUstomAnimatedLoader />
                        </>

                }
            </ScrollView>
        </ImageBackground>
    )
}

export default HelpAndFeedBackScreen