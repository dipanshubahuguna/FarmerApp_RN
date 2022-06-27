import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, Dimensions, TouchableOpacity,Linking} from 'react-native';



const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

const { height, width } = Dimensions.get('window')

const VideoPost = ({ data }) => {

    const convertLocalTimeToUTCTime = () => {
        const dateString = data.created_at;
        const [fullDate, time] = dateString.split('T');
        const [year, month, date] = fullDate.split('-');
        const [hour, minute, S] = time.split(':');
        const [second] = S.split('.')
        return { year, month, date, hour, minute, second }
    };

    const DATE = convertLocalTimeToUTCTime()
    console.log(DATE)


    console.log("route", data)
    return (
        <>
            <ImageBackground source={require('../assets/plain-black-background.jpg')} style={{ height: 180, width: width - 60 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(data.path);
                        }}
                    >
                        <Image source={require('../assets/play-removebg-preview.png')} style={{ height: 70, width: 70 }} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <Text style={{ color: 'rgba(254,138,53,255)', fontWeight: '600', fontSize: 16, padding: 10, paddingLeft: 0 }}>{data.name}</Text>
            <Text style={{ color: 'rgba(9,170,103,1)' }} >
                {monthsList[DATE.month[1] - 1]} {DATE.date},{DATE.year} at {DATE.hour}:{DATE.minute}
            </Text>
            <Text style={{ color: '#000', padding: 10, paddingLeft: 0 }}>{data.description}</Text>
            <View style={{ height: 1, backgroundColor: '#000' }}></View>
        </>
    )
}


export default VideoPost