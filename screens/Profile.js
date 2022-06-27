import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import client from '../api/client';
import CustomHeader from '../components/CustomHeader';
import CustomProfileLabels from '../components/CustomProfileLabels';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';


const { height, width } = Dimensions.get('window')

const Profile = ({ navigation }) => {

    const { userGlobal } = useLogin();

    const [user, setUser] = useState({})
    const [profileImage, setProfileImage] = useState()
    const [isLoading,setIsLoading] = useState(true)

    const fetchUser = async () => {

        try {
            const token = await AsyncStorage.getItem('token')
            const res = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data)
            console.log(res.data.name)
            // console.log(res.data.phone)
            setUser(res.data)
            if(res.data.kyc != null){
                setProfileImage(res.data.kyc.photo)
            }
            if(user){
                setIsLoading(false)
            }
            // console.log(profileImage)
            // console.log("user in profile screen ----- ",res.data.kyc.photo)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])

    // const [userInfo, setUserInfo] = useState({
    //     phone: '',
    //     aadhar: '',
    //     bank: '',
    //     address: ''
    // })

    const [visibleEdit, setVisibleEdit] = useState(false)
    // const { phone, aadhar, bank, address } = userInfo

    // const handelOnChangeText = (value, fieldName) => {
    //     setVisibleEdit(true)
    //     setUserInfo({ ...userInfo, [fieldName]: value })
    // }

    return (
        <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={{ flex: 1 }}>
            {
                isLoading ?
                    <View>
                        <CustomHeader navigation={navigation} />
                        <CUstomAnimatedLoader />
                    </View>
                    :
                    <ScrollView>
                        <CustomHeader navigation={navigation} />
                        <View style={{ flexDirection: 'column', marginTop: 40, alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'grey', fontWeight: '500', color: 'rgba(136,136,136,255)' }}>
                                Profile
                            </Text>
                            {
                                profileImage
                                    ?
                                    <Image style={[styles.avatar, { height: 130, width: 130,paddingTop:20 }]} source={{ uri: profileImage }} />
                                    :
                                    <Image style={[styles.avatar, { height: 150, width: 150,paddingTop:20 }]} source={require('../assets/Dp.png')} />

                            }
                            <Text style={{ fontWeight: 'bold', color: 'rgba(64,64,64,255)', fontSize: 25,paddingTop:20, }}>
                                {user.name}
                            </Text>
                        </View>
                        {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                </View> */}
                        <View style={{ paddingTop: 30, flexDirection: 'column' }}>
                            <CustomProfileLabels title="Phone no." value={user.phone}/>
                            <CustomProfileLabels title="Email" value={user.email} />
                            <CustomProfileLabels title="Bank" value={user.bank.ac_number} />
                        </View>
                        {visibleEdit
                            ?
                            <TouchableOpacity>
                                <View style={{ backgroundColor: '#FF9A17', height: 30, width: 100, borderRadius: 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#fff' }}>
                                        Edit
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View>
                            </View>
                        }
                    </ScrollView>
            }
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 63,
        borderWidth: 3,
        borderColor: "white",
        // marginBottom: 10,
        position: 'relative',
        // marginTop: 30,
        marginLeft: 10
    },
    profile: {
        marginLeft: 80,
    },
    feed: {
        marginLeft: 20,
        marginTop: 10,
    },
    outer: {
        backgroundColor: '#FF9A17',
        flexDirection: 'row',
        borderRadius: 40,
        height: 45,
        width: width - 90,
        marginBottom: 20,
        alignSelf: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
        // position: 'relative'
    },
    inner: {
        backgroundColor: '#190033',
        borderRadius: 40,
        width: '30%',
        // marginRight: width - 270,
        // alignItems: 'flex-start'
    },
    button: {
        height: 35,
        width: width - 90,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 40,
        backgroundColor: '#FF9A17'
    },
    submit: {
        height: 45,
        width: width - 50,
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 15,
        backgroundColor: '#FF4500'
    }
})


export default Profile