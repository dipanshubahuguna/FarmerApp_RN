import React, { Component, useEffect, useState } from 'react';
import { View, Image, Text, ImageBackground, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import CustomHeaderKN from '../components/CustomHeaderKN';
import Share from 'react-native-share'
import { Base64 } from 'js-base64';
import ImgToBase64 from 'react-native-image-base64';

const { height, width } = Dimensions.get('window')


const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']



const Post = ({ navigation, route }) => {

    const [sharingImage, setSharingImage] = useState()

    const convertLocalTimeToUTCTime = () => {
        const dateString = route.params.data.created_at;
        const [fullDate, time] = dateString.split('T');
        const [year, month, date] = fullDate.split('-');
        const [hour, minute, S] = time.split(':');
        const [second] = S.split('.')
        return { year, month, date, hour, minute, second }
    };

    const DATE = convertLocalTimeToUTCTime()
    // console.log(DATE)


    let extension = route.params.data.logo.split('.')

    // console.log(route.params.data.logo)
    useEffect(() => {
        setSharingImage(Base64.encode('../assets/logo_150x100-removebg-preview.png'))
    })

    // console.log(sharingImage)
    // console.log(extension[extension.length - 1])
    // console.log(`data:image/${extension[extension.length - 1]};base64,${sharingImage}`)

    const myCustomShare = async () => {
        const shareOptions = {
            // message: `test msg`,
            message : `${route.params.data.name} \n ${route.params.data.content}`,
            scoial : Share.Social.FACEBOOK_STORIES,
            // url : `data:image/${extension[extension.length - 1]};base64,${sharingImage}`
        }
        try {
            const res = await Share.open(shareOptions)
            console.log(res)
            // console.log(res.json())
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ImageBackground
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            <ScrollView>
                <CustomHeaderKN navigation={navigation} />
                <View style={{ alignSelf: 'center', width: width - 40, marginBottom: 300 }} >
                    <Image source={{ uri: route.params.data.logo }} style={{ alignSelf: 'center', marginTop: 20, height: 300, width: width - 40 }} />
                    <Text style={{ fontSize: 23, color: '#000', padding: 10, paddingLeft: 0, fontFamily: 'Montserrat Bold' }} >
                        {route.params.data.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(9,170,103,1)', fontFamily: 'Montserrat SemiBold' }} >
                            {monthsList[DATE.month[1] - 1]} {DATE.date},{DATE.year} at {DATE.hour}:{DATE.minute}
                        </Text>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={myCustomShare}>
                            <Image style={{ height: 20, width: 20, marginLeft: 20 }} source={require('../assets/share.png')} />
                            <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold', fontSize: 15, marginLeft: 3 }}>
                                Share
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingTop: 20 }}>
                        <Text style={{ fontSize: 16, color: '#000', fontFamily: 'Calibri Regular' }} >
                            Post Screen {route.params.data.content}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default Post