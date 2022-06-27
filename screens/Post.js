import React, { Component } from 'react';
import { View, Image, Text, ImageBackground, Dimensions,ScrollView } from 'react-native';

const { height, width } = Dimensions.get('window')


const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']



const Post = ({ navigation, route }) => {

    const convertLocalTimeToUTCTime = () => {
        const dateString = route.params.data.created_at;
        const [fullDate, time] = dateString.split('T');
        const [year, month, date] = fullDate.split('-');
        const [hour, minute, S] = time.split(':');
        const [second] = S.split('.')
        return { year, month, date, hour, minute, second }
    };

    const DATE = convertLocalTimeToUTCTime()
    console.log(DATE)

    return (
        <ImageBackground
            source={require('../assets/Background.png')}
            resizeMode="cover"
            style={{ flex: 1 }}
        >
            <ScrollView>
                <View style={{ alignSelf: 'center', width: width - 40,marginBottom:300 }} >
                    <Image source={{ uri: route.params.data.logo }} style={{ alignSelf: 'center', marginTop: 20, height: 300, width: width - 40 }} />
                    <Text style={{ fontSize: 23, color: '#000', padding: 10, paddingLeft: 0 }} >
                        {route.params.data.name}
                    </Text>
                    <Text style={{ color: 'rgba(9,170,103,1)' }} >
                        {monthsList[DATE.month[1] - 1]} {DATE.date},{DATE.year} at {DATE.hour}:{DATE.minute}
                    </Text>
                    <View style={{ paddingTop: 20 }}>
                        <Text style={{ fontSize: 16,color: '#000'}} >
                            Post Screen {route.params.data.content}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default Post