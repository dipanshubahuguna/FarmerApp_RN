import React, { Component, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import client from '../api/client';



const { height, width } = Dimensions.get('window')


const CustomHeader = ({ navigation }) => {


    console.log("width of screen --------", width);

    const [imageProfile, setImageProfile] = useState('')

    const fetchApi = async () => {
        const token = await AsyncStorage.getItem('token')
        try {
            const res = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(res.data)

            if (res.data.kyc != null) {
                setImageProfile(res.data.kyc.photo)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchApi()
    }, [imageProfile])
    return (
        <View style={{ flexDirection: 'row', marginTop: 20,}}>
            <TouchableOpacity
                style={{width:'25%'}}
                onPress={() => { navigation.openDrawer() }}>
                <Image style={[{ marginLeft: 20, height: 40, width: 40 }]} source={require('../assets/hamburger_menu_vector.png')} />
            </TouchableOpacity>
            {/* <View style={{ width: width / 4 }}>
            </View> */}
            <View style={{ alignItems: 'flex-end',width:'45%' }}>
                <Image style={{ height: 50, width: 100, alignSelf: 'center' }} source={require('../assets/logo_150x100-removebg-preview.png')} />
            </View>
            {/* <View style={{ width: width / 8 }}>
            </View> */}
            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',width:'30%' }}>
                <Image style={[{ height: 30, width: 30 }]} source={require('../assets/Notification.png')} />
                <View style={{ height: 50, width: 50, marginLeft: 10 }}>
                    {
                        imageProfile
                            ?
                            <Image style={[styles.avatar]} source={{ uri: imageProfile }} />
                            :
                            <Image style={[styles.avatar]} source={require('../assets/Dp.png')} />
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 63,
        position: 'absolute',
    }
})


export default CustomHeader