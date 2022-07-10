import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"

import LottieView from 'lottie-react-native';
import client from '../../api/client';
import axios from 'axios';

const Lottie3 = ({ navigation, route }) => {
    const animationRef = useRef()

    // const [photo, setPhoto] = useState([])
    // const [doc, setDoc] = useState([])

    // const postDetails = async () => {
    //     const token = await AsyncStorage.getItem('token');
    //     const farmer_id = await AsyncStorage.getItem('userId');

    //     // console.log('farmer_id', farmer_id);
    //     // let doc = route.params.data.doc
    //     // let doc_type = route.params.data.doc_type
    //     // let photo = route.params.data.photo

    //     // const farmer_id = farmer_id
    //     const photo__ = route.params.data.photo
    //     const doc_type = route.params.data.doc_type
    //     const doc__ = route.params.data.doc

    //     console.log('doc', doc__);
    //     console.log('doc_type', doc_type);
    //     console.log('photo', photo__);
    //     console.log('token', token);


    //     const photo = new FormData()
    //     photo.append("photo", {
    //         uri: photo__,
    //         name: 'photo.jpg',
    //         type: 'jpg'
    //     })

    //     console.log("photoToSend", photo)

    //     const doc = new FormData()
    //     doc.append("doc", {
    //         uri: doc__,
    //         name: 'doc.jpg',
    //         type: 'jpg'
    //     })

    //     console.log("docToSend", doc)
    //     try {


    //         const post = await axios.post('http://printrly.com/public/api/kyc',
    //         { farmer_id, photo, doc_type, doc },
    //         {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         })
    //         console.log("profile upload", post.data)
    //         console.log("profile upload", post)
    //     } catch (error) {
    //         console.log(error)
    //     }

    // }

    useEffect(() => {
        // postDetails()
        // fetchAPi()
        animationRef.current?.play();
    }, []);

    setTimeout(() => {
        navigation.replace('TabScreen');
    }, 2000);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <LottieView
                source={require('../../assets/done.json')}
                ref={(animation) => {
                    animationRef.current = animation;
                }}
                autoPlay
                loop={false}
            />
        </View>
    )
}


export default Lottie3