import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, Alert } from 'react-native'
import { RadioButton } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios';
import client from '../api/client';


const { height, width } = Dimensions.get('window')


const IdentityProof = ({ navigation }) => {


    const baseurl = 'https://printrly.com/public/api/kyc';

    const [checked, setChecked] = useState()

    const [image, setImage] = useState('null');
    const [file, setFile] = useState('null');
    const [id,setID] = useState('')
    // const [uploadData, setUploadData] = useState(null)

    const [success, setSuccess] = useState('Select document type and document by clicking above');

    // const [err,setErr] = useState(false)

    const pickImage = async () => {
        var results = await launchImageLibrary({
          mediaType: 'photo',
          quality: 1,
          includeBase64: false,
        });
        let result = results.assets[0];
    
        const token = await AsyncStorage.getItem('token');
        const farmer_id = await AsyncStorage.getItem('userId');
    
        let data = new FormData();
        data.append('document', {
          uri: result.uri,
          type: result.type,
          name: result.fileName,
        });
        data.append('farmer_id', farmer_id);
        data.append('doc_type', checked);
    
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
          setSuccess('click upload button');
        }
      };
    
      /*  * UPLOAD_IMAGE_FUNCTION_READ *
       * Use file state in body
       * can use try catch to handle error
       * set success state
       */
    
      const upload = async () => {
    
        
        const token = await AsyncStorage.getItem('token');
        const farmer_id = await AsyncStorage.getItem('userId');
    
        setSuccess('uploading..');
        let res = await fetch(baseurl, {
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
        navigation.replace('Lottie1')
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


    return (
        <ImageBackground style={{ flex: 1,backgroundColor:'#fff' }}>
            <View style={{ height: '10%' }}>
            </View>
            <View style={{ alignItems: 'center', height: '10%' }}>
                <Text style={{ fontSize: 21, color: 'black',fontFamily:'Montserrat Bold'}}>
                    Upload Your Identity Proof
                </Text>
                <Image style={{ height: 70, width: 380, alignItems: 'center' }} source={require('../assets/Register.jpg')} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'center' }}>
                <RadioButton
                    value='aadhar'
                    status={checked == 'aadhar' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('aadhar')}
                    color='rgba(234,161,67,255)'
                />
                <Text style={{ color: '#000', paddingRight: 20, fontSize: 12,fontFamily:'Montserrat SemiBold'}}>
                    Aadhar Card
                </Text>
                <RadioButton
                    value='ration'
                    status={checked == 'ration' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('ration')}
                    color='rgba(234,161,67,255)'
                />
                <Text style={{ color: '#000', paddingRight: 20, fontSize: 12,fontFamily:'Montserrat SemiBold' }}>
                    Ration Card
                </Text>
                <RadioButton
                    value='voter'
                    status={checked == 'voter' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('voter')}
                    color='rgba(234,161,67,255)'
                />
                <Text style={{ color: '#000', paddingRight: 20, fontSize: 12,fontFamily:'Montserrat SemiBold' }}>
                    Voter Card
                </Text>
            </View>
            <TouchableOpacity onPress={pickImage}>
                <Image style={{ marginTop: 10, marginLeft: width / 5, alignItems: 'center', height: 250, width: 250 }} source={require('../assets/Identitiy-proog.jpg')} />
            </TouchableOpacity>
            <View >
                {
                    image
                        ? <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 20 }}>
                            <Image source={{ uri: image }} style={{ height: 50, width: 50 }} />
                            {/* <Text style={{ color: '#000', marginBottom: 40 }}>Selected Document</Text> */}
                            <Text style={{ color: 'green', marginBottom: 0,fontFamily:'Montserrat SemiBold' }}>{success}</Text>
                        </View>

                        : <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
                            <Text style={{ color: 'green', marginBottom: 0,fontFamily:'Montserrat SemiBold'}}>{success}</Text>
                            {/* <Text style={{ color: '#000' }}>Select Identity proof by clicking above</Text> */}
                        </View>
                }
            </View>
            <TouchableOpacity style={styles.button}
                // onPress={()=> console.log("doc_type --- ",checked,"\ndoc ------ ",identityProof.assets[0].fileName)}
                onPress={upload}
            >
                <Text style={{ fontSize: 18, color: '#ffffff',fontFamily:'Montserrat Bold' }}>Upload</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

// navigation.replace('Lottie1')

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
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 18,
        backgroundColor: 'rgba(231,105,29,255)'
    }
})


export default IdentityProof