import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import client from '../api/client';
import { useLogin } from '../context/LoginProvider';

import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';

const options = {
    title: 'Select Image',
    type: 'library',
    options: {
        maxHeight: 200,
        maxWidth: 200,
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
    },
}


const { height, width } = Dimensions.get('window')
const ProfileUpload = ({ navigation, route }) => {

    const { t, i18n } = useTranslation()

    const [image, setImage] = useState('null');
    const [file, setFile] = useState('null');
    const [id,setID] = useState()


    const [success, setSuccess] = useState(`${t('common:profileUpload.selectProfilePicByClickingAbove')}`);

    // const pickImage = async () => {

    //     try {
    //         const token = await AsyncStorage.getItem('token');
    //         // const farmer_id = '100'
    //         const farmer_id = await AsyncStorage.getItem('userId');
    //         console.log(farmer_id)
    //         var result = await launchImageLibrary({
    //             mediaType: 'photo',
    //             quality: 1,
    //             includeBase64: false,
    //         });

    //         result = await result;

    //         setImage(result.assets[0].uri);
    //         setFile(result.assets[0]);

    //         let data = new FormData();

    //         data.append('photo', {
    //             uri: file.uri,
    //             type: file.type,
    //             name: file.fileName,
    //         });

    //         console.log("data", data)

    //         const upload = async (data) => {
    //             try {
    //                 let resp = await fetch('http://printrly.com/public/api/kyc/`${farmer_id}`', {
    //                     method: 'post',
    //                     body: data,
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                         Accept: 'application/json',
    //                         'Content-Type': 'multipart/form-data',
    //                     },
    //                 });
    //                 resp = await resp.json();
    //                 console.log("resp----", resp);
    //                 return true
    //             } catch (error) {
    //                 console.log("error in catch ", error)
    //                 return false
    //             }
    //         }

    //         if(upload(data) == false){
    //             upload(data)
    //         }
    //         if (upload(data) === true) {
    //             // upload(data);
    //             console.log('Uploaded')
    //         }
    //     } catch (error) {
    //         console.log("error----", error)
    //     }
    // };

    // const{ userGlobal } = useLogin()

    // console.log(userGlobal)

    // const fetchApi = async () => {
    //     const token = await AsyncStorage.getItem('token');
    //     const userId = await AsyncStorage.getItem('userId');
    //     // console.log("route ---- ", route)
    //     // console.log("userId ---- ", userId)
    // }

    // useEffect(() => {
    //     fetchApi()
    // }, [])

    // const fetchApi = async () => {
    //     const farmer_id = await AsyncStorage.getItem('userId')
    //     if (farmer_id) {
    //         setBaseUrl(`http://printrly.com/public/api/kyc/${farmer_id}`)
    //         console.log(baseurl)
    //     }
    // }

    // useEffect(() => {
    //     fetchApi()
    // }, [])


    const pickImage = async () => {
        var results = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
        });
        let result = results.assets[0];


        // const token = await AsyncStorage.getItem('token');
        // const farmer_id = await AsyncStorage.getItem('userId');

        let data = new FormData();
        data.append('photo', {
            uri: result.uri,
            type: result.type,
            name: result.fileName,
        });
        // data.append('farmer_id', 6);
        // data.append('doc_type', 'pan');

        console.log('form data', data);

        /* set image preview */
        setImage(uri => {
            return result.uri;
        });

        /* set file for formdata */
        setFile(pre => {
            return data;
        });

        /* after file value change setSuccess will execute */
        if (file) {
            setSuccess(`${t('common:profileUpload.clickUploadButton')}`);
        }
    };

    const upload = async () => {


        const token = await AsyncStorage.getItem('token');
        const farmer_id = await AsyncStorage.getItem('userId');

        setSuccess('uploading..');
        let res = await fetch(`http://printrly.com/public/api/kyc/${farmer_id}`, {
            method: 'post',
            body: file,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        res = await res.json();

        if (!res.error) {
            setSuccess(res.message);
        }
        console.log(res);
        navigation.replace('Lottie3')
    };

    const fetchUser = async () =>{
        try {
            const token = await AsyncStorage.getItem('token')
            const res = await client.get('/user',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(res.data)
            setID(res.data.bank.farmer_id)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchUser()
    })


    const [profilePicture, setProfilePicture] = useState('')

    const openGallery = async () => {
        const image = await launchImageLibrary(options)
        // console.log(image)
        console.log(image.assets[0].uri)
        setProfilePicture(image.assets[0].uri)
    }

    return (
        <ImageBackground style={{ flex: 1,backgroundColor:'#fff' }}>
            <View style={{ height: '10%' }}>
            </View>
            <View style={{ alignItems: 'center', height: '15%' }}>
                <Text style={{ fontSize: 21, color: 'black',fontFamily:'Montserrat Bold' }}>
                    {t('common:profileUpload.uploadPic')}
                    {/* {t('common:profileUpload.')} */}
                </Text>
                <Image style={{ height: 60, width: 350, alignItems: 'center' }} source={require('../assets/KYC-Upload.jpg')} />
            </View>
            <TouchableOpacity onPress={pickImage}>
                <Image style={{ marginTop: 10, marginLeft: width / 5, alignItems: 'center', height: 250, width: 250 }} source={require('../assets/upload.png')} />
            </TouchableOpacity>
            <View >
                {
                    image
                        ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 20 }}>
                            <Image source={{ uri: image }} style={{ height: 50, width: 50 }} />
                            <Text style={{ color: 'green', marginBottom: 0,fontFamily:'Montserrat SemiBold'}}>{success}</Text>
                        </View>
                        : <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ color: 'green', marginBottom: 0,fontFamily:'Montserrat SemiBold' }}>{success}</Text>
                        </View>
                }
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={upload}
            >
                <Text style={{ fontSize: 18, color: '#ffffff',fontFamily:'Montserrat Bold' }}>{t('common:profileUpload.upload')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.skip}
                onPress={() => navigation.replace('TabScreen')}
            >
                <Text style={{ fontSize: 12, color: '#ffffff',fontFamily:'Montserrat Bold' }}>Skip</Text>
            </TouchableOpacity>
        </ImageBackground>

    )
}

// navigation.replace('Lottie3')

const styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 63,
        borderWidth: 3,
        borderColor: "white",
        marginBottom: 10,
        position: 'absolute',
        marginTop: 50,
        marginLeft: 10
    },
    profile: {
        marginLeft: 80,
    },
    feed: {
        marginLeft: 20,
        marginTop: 10,
    },
    button: {
        height: 45,
        width: width - 50,
        marginTop: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10,
        backgroundColor: 'rgba(254,138,53,255)'
    },
    skip: {
        height: 30,
        width: width - 350,
        marginTop: 20,
        marginRight: 25,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10,
        backgroundColor: 'rgba(254,138,53,255)'
    }
})

export default ProfileUpload