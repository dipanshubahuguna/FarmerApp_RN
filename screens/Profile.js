import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView, RefreshControl, Touchable } from 'react-native'
import client from '../api/client';
import CustomHeader from '../components/CustomHeader';
import CustomProfileLabels from '../components/CustomProfileLabels';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { TextInput } from 'react-native-paper';


import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';


// const { t, i18n } = useTranslation()


const { height, width } = Dimensions.get('window')

const Profile = ({ navigation }) => {

    const { userGlobal } = useLogin();

    const { t, i18n } = useTranslation()

    const [refreshing, setRefreshing] = useState(false);
    const [image, setImage] = useState(null)
    const [user, setUser] = useState({})
    const [profileImage, setProfileImage] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [nameEdit, setNameEdit] = useState(false)
    const [nameToEdit, setNameToEdit] = useState(null)
    const [file, setFile] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [id, setID] = useState('')

    const updateMessage = (message, stateUpdater) => {

        stateUpdater(message)
        setTimeout(() => {
            setSuccessMessage('')
        }, 2500);

    }


    const pickImage = async () => {
        try {
            // console.log("clicked")
            var results = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
                includeBase64: false,
            });
            let result = results.assets[0];
            console.log("result.uri", result.uri)

            setImage(result.uri)
            let data = new FormData();
            data.append('photo', {
                uri: result.uri,
                type: result.type,
                name: result.fileName,
            });


            console.log('form data', data);
            setFile(() => {
                return data
            })

            console.log("file  ---- 0", file)
        } catch (error) {
            console.lof(error)
        }
    }

    const uploadImage = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const farmer_id = await AsyncStorage.getItem('userId')
            console.log(farmer_id)
            console.log(token)
            console.log("file ----------------", file)
            const res = await fetch(`http://printrly.com/public/api/kyc/${id}`, {
                method: 'post',
                body: file,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            })
            let resp = await res.json()

            console.log("res.data ---------------", resp.message)

            let setter = 1

            if (resp.message === "Updated Successfully") {
                updateMessage(`${t('common:profileScreen.photoUpdatedSuccessfully')}`, setSuccessMessage)
                setter = 0
            }
            if (setter) {
                updateMessage(`${t('common:profileScreen.tryAgain')}`, setSuccessMessage)
            }

        } catch (error) {
            console.log("Error ----- 1", error)
        }
    }
    const editName = async () => {
        console.log('NameToEdit', nameToEdit)

        try {
            const token = await AsyncStorage.getItem('token')
            const farmer_id = await AsyncStorage.getItem('userId')
            console.log("farmer_id ------ ", farmer_id)
            console.log(token)

            const res = await client.put(`/user/${id}`, { "name": nameToEdit }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data)
        } catch (error) {
            console.log("Error ----- 2", error)
        }

    }

    const fetchUser = async () => {

        try {
            const token = await AsyncStorage.getItem('token')
            const farmer_id = await AsyncStorage.getItem('userId')
            // console.log(farmer_id)
            console.log(token)
            const res = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("User details in Profile screen", res.data.id)
            setID(res.data.id)

            console.log(res.data.name)
            // console.log(res.data.phone)
            setUser(res.data)
            if (res.data.kyc != null) {
                setProfileImage(res.data.kyc.photo)
            }
            if (user) {
                setIsLoading(false)
            }
            // console.log(profileImage)
            // console.log("user in profile screen ----- ",res.data.kyc.photo)
        } catch (error) {
            console.log("Error ----- 3", error)
        }
    }


    const onRefresh = () => {
        setRefreshing(true)
        fetchUser()
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
    }


    useEffect(() => {
        fetchUser()
    }, [profileImage])

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
        <ImageBackground style={{ flex: 1, backgroundColor: '#fff' }}>
            <CustomHeader navigation={navigation} />
            {
                isLoading ?
                    <View>
                        {/* <CustomHeader navigation={navigation} /> */}
                        <CUstomAnimatedLoader />
                    </View>
                    :
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled={true}
                        style={{ marginBottom: 100 }}
                    >
                        <View style={{ flexDirection: 'column', marginTop: 40, alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'grey', fontFamily: 'Montserrat Bold', color: 'rgba(136,136,136,255)' }}>
                                {t('common:profileScreen.profile')}
                            </Text>
                            <View style={{ flexDirection: 'column', paddingLeft: 0, alignSelf: 'center' }}>
                                {/* <Image style={[styles.avatar, { height: 130, width: 130, paddingTop: 20 }]} source={{ uri: profileImage }} />
                                        <TouchableOpacity
                                            style={{ alignSelf: 'flex-end', marginLeft: -20 }} onPress={pickImage}>
                                            <View style={{ borderColor: '#000', borderWidth: 0.2, width: 30, alignItems: 'center', borderRadius: 5 }}>
                                                <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                    Edit
                                                </Text>
                                            </View>
                                        </TouchableOpacity> */}
                                {
                                    image
                                        ?
                                        <View style={{ alignItems: 'center', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'column' }}>
                                                <Image style={[styles.avatar, { height: 130, width: 130, paddingTop: 20 }]} source={{ uri: image }} />
                                                <View style={{ alignItems: 'center' }}>
                                                    <Text style={{ color: '#000' }}>
                                                        {t('common:profileScreen.selectedImage')}
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                        <View style={{ borderColor: '#000', borderWidth: 0.2, width: 50, alignItems: 'center', borderRadius: 5, marginRight: 10 }}>
                                                            <TouchableOpacity onPress={() => {
                                                                console.log('Discard')
                                                                setImage(null)
                                                            }}>
                                                                <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                                    {t('common:profileScreen.discard')}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ borderColor: '#000', borderWidth: 0.2, width: 60, alignItems: 'center', borderRadius: 5, marginLeft: 10 }}>
                                                            <TouchableOpacity onPress={() => {
                                                                console.log('Update')
                                                                uploadImage()
                                                                setImage(null)
                                                            }}>
                                                                <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                                    {t('common:profileScreen.update')}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ alignItems: 'center' }}>
                                            <View style={{ paddingBottom: 5 }}>
                                                {successMessage == 'Try Again' ?
                                                    <Text style={{ color: 'red', fontFamily: 'Calibri Light' }}>
                                                        {successMessage}
                                                    </Text>
                                                    :
                                                    <Text style={{ color: 'green', fontFamily: 'Calibri Light' }}>
                                                        {successMessage}
                                                    </Text>
                                                }
                                            </View>
                                            {
                                                profileImage
                                                    ?
                                                    <Image style={[styles.avatar, { height: 130, width: 130, paddingTop: 20 }]} source={{ uri: profileImage }} />
                                                    :
                                                    <Image style={[styles.avatar, { height: 130, width: 130, paddingTop: 20 }]} source={require('../assets/Dp.png')} />
                                            }
                                            <TouchableOpacity
                                                style={{ alignSelf: 'flex-end', marginLeft: -20 }} onPress={pickImage}>
                                                <View style={{ borderColor: '#000', borderWidth: 0.2, width: 40, alignItems: 'center', borderRadius: 5 }}>
                                                    <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                        {t('common:profileScreen.edit')}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 20, paddingLeft: 40 }}>
                                {
                                    nameEdit
                                        ?
                                        <View style={{ flexDirection: 'column', height: 50, alignContent: 'center' }}>
                                            <TextInput
                                                style={{ height: 30, width: 200, borderWidth: 0.2, backgroundColor: '#fff' }}
                                                onChangeText={setNameToEdit}
                                                value={nameToEdit}
                                                placeholder={t('common:profileScreen.enterName')}
                                            />
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity onPress={() => {
                                                    setNameEdit(false)
                                                    setNameToEdit('')
                                                }}>
                                                    <View style={{ borderColor: '#000', borderWidth: 0.2, width: 50, marginTop: 10, alignItems: 'center', borderRadius: 5 }}>
                                                        <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                            {t('common:profileScreen.discard')}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ width: 100 }}>
                                                </View>
                                                <TouchableOpacity onPress={() => {
                                                    editName()
                                                    setNameToEdit('')
                                                    setNameEdit(false)
                                                    updateMessage(`${t('common:profileScreen.nameUpdatedSuccess')}`, setSuccessMessage)
                                                }}>
                                                    <View style={{ borderColor: '#000', borderWidth: 0.2, width: 50, marginTop: 10, alignItems: 'center', borderRadius: 5 }}>
                                                        <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                            {t('common:profileScreen.update')}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        :
                                        <>
                                            <Text style={{ color: 'rgba(64,64,64,255)', fontFamily: 'Montserrat Bold', fontSize: 25, }}>
                                                {user.name}
                                            </Text>
                                            <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 10 }} onPress={() => setNameEdit(true)}>
                                                <View style={{ borderColor: '#000', borderWidth: 0.2, width: 40, alignItems: 'center', borderRadius: 5 }}>
                                                    <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                                        {t('common:profileScreen.edit')}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>

                                }
                                {/* <Text style={{ color: 'rgba(64,64,64,255)', fontFamily: 'Montserrat Bold', fontSize: 25, }}>
                                    {user.name}
                                </Text>
                                <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 10 }} onPress={() => setNameEdit(!nameEdit)}>
                                    <View style={{ borderColor: '#000', borderWidth: 0.2, width: 30, alignItems: 'center', borderRadius: 5 }}>
                                        <Text style={{ color: 'gray', fontFamily: 'Calibri Light Italic' }}>
                                            Edit
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {nameEdit  
                                ?
                                <View style={{height:20,width:250}}>
                                    <TextInput style={{}}/>
                                </View>
                                :
                                <Text style={{color:'#000'}}>
                                    false
                                </Text>
                                } */}
                            </View>
                        </View>
                        {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                </View> */}
                        <View style={{ paddingTop: 30, flexDirection: 'column' }}>
                            <CustomProfileLabels title={t('common:profileScreen.uniqueID')} value={user.unique_id} />
                            <CustomProfileLabels title={t('common:profileScreen.phoneNum')} value={user.phone} />
                            <CustomProfileLabels title={t('common:profileScreen.email')} value={user.email} />
                            {
                                user.bank
                                    ?
                                    <CustomProfileLabels title={t('common:profileScreen.bank')} value={user.bank.ac_number} />
                                    :
                                    <CustomProfileLabels title={t('common:profileScreen.bank')} value="______________" />

                            }
                        </View>
                        {/* {visibleEdit
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
                        } */}
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