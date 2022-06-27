import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"

import { signOut } from '../api/user';
import client from '../api/client';

const CustomDrawer = (props) => {

    const [profileImage,setProfileImage] = useState()

    const fetchApi = async () =>{
        try {
            const token = await AsyncStorage.getItem('token')
            const res = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data)
            setProfileImage(res.data.kyc.photo)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchApi()
    },[])

    const { setIsLoggedIn, profile, userGlobal } = useLogin();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                contentContainerStyle={{ backgroundColor: 'rgba(9,170,103,255)' }}
                {...props}>
                <View style={{ flexDirection: 'row' }}>
                {
                    profileImage 
                    ?
                    <Image style={{ marginTop: 10, marginLeft: 20, height: 80, width: 80,borderRadius: 100 }} source={{uri : profileImage}} />
                    :
                    <Image style={{ marginTop: 10, marginLeft: 20, height: 100, width: 100 }} source={require('../assets/Dp.png')} />

                }
                    {/* <Image style={{ marginTop: 10, marginLeft: 20, height: 100, width: 100 }} source={require('../assets/Dp.png')} /> */}
                    <Image style={{ marginLeft: 10, height: 100, width: 130 }} source={require('../assets/logo_150x100-removebg-preview.png')} />
                </View>
                <View>
                    <Text style={{ color: '#fff', fontWeight: '400', fontSize: 23, marginLeft: 18,fontFamily:'Montserrat Bold'}}>
                        {userGlobal.name}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 10, marginLeft: 18, marginBottom: 18,fontFamily:'Montserrat Bold' }}>
                        India
                    </Text>
                </View>
                <View style={{ backgroundColor: '#ffffff', padding: 10 }}>
                    <DrawerItemList {...props} />
                </View>
                <View style={{ backgroundColor: '#fff' }}>
                    <DrawerItem
                        onPress={async () => {
                            const isLoggedOut = await signOut()
                            if (isLoggedOut) {
                                setIsLoggedIn(false)
                            }
                        }}
                        icon={() => (<Image style={{ height: 20, width: 20 }} source={require('../assets/logout.png')} />)}
                        style={{ backgroundColor: '#ffffff', padding: 10 }} labelStyle={{fontFamily:'Montserrat Bold'}} label="Signout" />
                    <View style={{ height: 1, backgroundColor: 'grey', width: '90%', alignSelf: 'center' }}>
                    </View>
                    <DrawerItem
                        icon={() => (<Image style={{ height: 20, width: 20 }} source={require('../assets/share.png')} />)}
                        style={{ backgroundColor: '#ffffff', padding: 10 }} labelStyle={{fontFamily:'Montserrat Bold'}} label="Tell a Friend" />
                    <DrawerItem
                        icon={() => (<Image style={{ height: 20, width: 20 }} source={require('../assets/Help.png')} />)}
                        style={{ backgroundColor: '#ffffff', padding: 10 }} labelStyle={{fontFamily:'Montserrat Bold'}} label="Help and Feedback" />
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

export default CustomDrawer