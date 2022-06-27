/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, {useState} from 'react';
 import {View, Image, Button, Text} from 'react-native';
 import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
 
 // screens
//  import HomeScreen from './screens/HomeScreen';
 
 // components
//  import Header from './components/Header';
 
 const TestingScreen = () => {
   const [image, setImage] = useState('null');
   const [file, setFile] = useState('null');
   const [success, setSuccess] = useState(null);
 
   const pickImage = async () => {
     try {
       var result = await launchImageLibrary({
         mediaType: 'photo',
         quality: 1,
         includeBase64: false,
       });
 
       result = await result;
 
       setImage(result.assets[0].uri);
       setFile(result.assets[0]);
 
       let data = new FormData();
 
       data.append('photo', {
         uri: file.uri,
         type: file.type,
         name: file.fileName,
       });
       let resp = await fetch('http://printrly.com/public/api/upload', {
         method: 'post',
         body: data,
         headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
         },
       });
 
       resp = await resp.json();
       if (resp) {
         setSuccess('file uploaded');
         console.log(resp);
       }
     } catch (error) {
       setSuccess(error.message);
     }
   };
 
   return (
     <View>
       {/* <Header title="Todo" /> */}
       <Button title="upload" onPress={pickImage} />
       <Image
         source={{uri: image}}
         style={{width: 200, height: 200, margin: 40}}
       />
     </View>
   );
 };
 
 export default TestingScreen;
 