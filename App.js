/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage"

import LottieView from 'lottie-react-native';
// import LottieContent from 'lottie-react-native'

import { Modal } from 'react-native-paper';

import LoginProvider from './context/LoginProvider';
import MainNavigator from './MainNavigator';
// import KYCupload from './screens/KYCupload';
import IdentityProof from './screens/IdentityProof';
import KYCDetails from './screens/BankDetails';
import Profile from './screens/Profile';
import PriceScreen from './screens/PriceScreen';
import KnowledgeCentre from './screens/KnowledgeCentre';
import SellingCentre from './screens/SellingCentre';
import TabScreen from './screens/TabScreen';
import DrawerSlide from './screens/DrawerSlide';
import SplashScreen from './screens/SplashScreen';
import OnBoardingScreen from './screens/OnBoardingScreen';
import axios from 'axios'
import client from './api/client'
import BankDetails from './screens/BankDetails';
import Lottie from './screens/Lottie/Lottie1';
import ProfileUpload from './screens/ProfileUpload';
import { addMethod } from 'yup';
import SplashScreenLogin from './screens/SplashScreenLogin';
import TestingScreen from './screens/Lottie/TestingScreen';
import Videos from './screens/Videos';
import CustomReload from './components/CustomReload';
import Blogs from './screens/Blogs';

const Stack = createNativeStackNavigator();

const Splash = () => {
  return (
    <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='SplashScreen' component={SplashScreen} />
      <Stack.Screen name='TabScreen' component={TabScreen} />
    </Stack.Navigator>
  )
}



const App = () => {


  // const [image, setImage] = useState('null');
  // const [file, setFile] = useState('null');
  // const [success, setSuccess] = useState('upload status');

  // const baseurl = 'https://printrly.com/public/api/kyc';

  // const pickImage = async () => {
  //   try {
  //     var result = await launchImageLibrary({
  //       mediaType: 'photo',
  //       quality: 1,
  //       includeBase64: false,
  //     });

  //     result = await result;

  //     if (result) {
  //       setSuccess('uploading....');
  //     }

  //     setImage(result.assets[0].uri);
  //     setFile(result.assets[0]);

  //     let data = new FormData();

  //     data.append('document', {
  //       uri: file.uri,
  //       type: file.type,
  //       name: file.fileName,
  //     });

  //     data.append('farmer_id', 61);
  //     data.append('doc_type', 'pan');

  //     const upload = async (data, baseurl) => {
  //       setSuccess('saving...');
  //       console.log('reached')
  //       try {
  //         let resp = await fetch(baseurl, {
  //           method: 'post',
  //           body: data,
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'multipart/form-data',
  //             Authorization:
  //               'Bearer 270|AprgstUaCy9HoLcil0XQZEvuazyDBEjefs90wpDA',
  //           },
  //         });
  //         resp = await resp.json();
  //         console.log(resp);
  //         setSuccess(resp.message);
  //         return true;
  //       } catch (error) {
  //         return false;
  //       }
  //     };

  //     if (upload(data, baseurl) == false) {
  //       console.log('reached')
  //       upload(data);
  //     }
  //   } catch (error) {
  //     setSuccess('failed to upload');
  //     console.log('error_case_url', baseurl);
  //     console.log('error', error);
  //   }
  // };

  const [image, setImage] = useState('null');
  const [file, setFile] = useState('null');
  const [success, setSuccess] = useState('upload status');

  const baseurl = 'https://printrly.com/public/api/kyc';

  /*   * PICK_IMAGE_FUNCTION_READ *
   * select image in asynchronus method
   * result append in formdata immediately
   * can use try catch to handle error
   * then set state with callback (note: setState method takes time to update value)
   * after handling and set value with callback
   * set file state and time to execute upload function
   */

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
    let res = await fetch(`http://printrly.com/public/api/kyc/51`, {
      method: 'post',
      body: file,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer 218|IbX8HhJu5jCfR94Jy2L7sBIOSLdDXK2DAeWqwkb6',
      },
    });
    res = await res.json();

    if (!res.error) {
      setSuccess(res.message);
    }
    console.log(res);
  };

  return (
    // <>
    //   <LottiePrice/>
    // </>
    // <View>
    //   <Text style={{ fontSize: 20, color: 'green', padding: 10 }}>{success}</Text>
    //   <Button title="upload" onPress={pickImage} />
    //   <Image
    //     source={{ uri: image }}
    //     style={{ width: 200, height: 200, margin: 40 }}
    //   />
    // </View>
    // <View>
    //   <Text style={{ fontSize: 20, color: 'green', padding: 10 }}>{success}</Text>
    //   <Button title="select file" onPress={pickImage} />
    //   <Image
    //     source={{ uri: image }}
    //     style={{ width: 200, height: 200, margin: 40 }}
    //   />
    //   <Button title="upload" onPress={upload} />
    // </View>
    // <>
    //   <Blogs/>
    // </>
    //   <Videos />
    // <NavigationContainer>
    //   <ProfileUpload />
    // </NavigationContainer>
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>

    //  <NavigationContainer>
    //    <Splash/>
    //  </NavigationContainer>
  )
}

export default App
