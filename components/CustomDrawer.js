import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"
import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';
import Share from 'react-native-share'

import { signOut } from '../api/user';
import client from '../api/client';
import HelpAndFeedBackScreen from '../screens/HelpAndFeedbackScreen';

const CustomDrawer = (props) => {


    let url = 'www.test.com'

    const { t, i18n } = useTranslation()

    const [profileImage, setProfileImage] = useState()
    const [userName, setUserName] = useState()


    const myCustomShare = async () => {
        const shareOptions = {
            // message: `test msg`,
            // message: `${route.params.data.name} \n ${route.params.data.content}`,
            scoial: Share.Social.FACEBOOK_STORIES,
            url : `${url}`
        }
        try {
            const res = await Share.open(shareOptions)
            console.log(res)
            // console.log(res.json())
        } catch (error) {
            console.log(error)
        }
    }


    const fetchApi = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const res = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserName(res.data.name)
            console.log("res.data", res.data)
            setProfileImage(res.data.kyc.photo)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchApi()
    }, [])

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
                            <Image style={{ marginTop: 10, marginLeft: 20, height: 80, width: 80, borderRadius: 100 }} source={{ uri: profileImage }} />
                            :
                            <Image style={{ marginTop: 10, marginLeft: 20, height: 100, width: 100 }} source={require('../assets/Dp.png')} />

                    }
                    {/* <Image style={{ marginTop: 10, marginLeft: 20, height: 100, width: 100 }} source={require('../assets/Dp.png')} /> */}
                    <Image style={{ marginLeft: 10, height: 100, width: 130 }} source={require('../assets/logo_150x100-removebg-preview.png')} />
                </View>
                <View>
                    <Text style={{ color: '#fff', fontWeight: '400', fontSize: 23, marginLeft: 18, fontFamily: 'Montserrat Bold' }}>
                        {userName}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 10, marginLeft: 18, marginBottom: 18, fontFamily: 'Montserrat Bold' }}>
                        {t('common:drawerSlide.india')}
                    </Text>
                </View>
                <View style={{ backgroundColor: '#ffffff', padding: 10 }}>
                    <DrawerItemList {...props} />
                </View>
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ height: 1, backgroundColor: 'grey', width: '90%', alignSelf: 'center' }}>
                    </View>
                    <DrawerItem
                        onPress={async () => {
                            const isLoggedOut = await signOut()
                            if (isLoggedOut) {
                                setIsLoggedIn(false)
                            }
                        }}
                        icon={() => (<Image style={{ height: 20, width: 20 }} source={require('../assets/logout.png')} />)}
                        style={{ backgroundColor: '#ffffff', padding: 10 }} labelStyle={{ fontFamily: 'Montserrat Bold' }} label={t('common:drawerSlide.signOut')} />
                    <DrawerItem
                        onPress={myCustomShare}
                        icon={() => (<Image style={{ height: 20, width: 20 }} source={require('../assets/share.png')} />)}
                        style={{ backgroundColor: '#ffffff', padding: 10 }} labelStyle={{ fontFamily: 'Montserrat Bold' }} label={t('common:drawerSlide.tellFriend')} />
                    {/* <DrawerItem
                        onPress={() => props.navigation.navigate('HelpAndFeedbackScreen')}
                        component={HelpAndFeedBackScreen}
                        icon={() => (<Image style={{ height: 20, width: 20 }} source={require('../assets/Help.png')} />)}
                        style={{ backgroundColor: '#ffffff', padding: 10 }} labelStyle={{ fontFamily: 'Montserrat Bold' }} label={t('common:drawerSlide.helpFeedBack')} /> */}
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

export default CustomDrawer