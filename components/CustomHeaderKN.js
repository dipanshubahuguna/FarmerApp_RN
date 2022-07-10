import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image,Dimensions } from 'react-native';


const { height, width } = Dimensions.get('window')

const CustomHeaderKN = ({navigation}) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                <Image style={[{ marginLeft: 20, height: 30, width: 30 }]} source={require('../assets/Back.png')} />
            </TouchableOpacity>
            {/* <Image style={[{ marginLeft: width - 100, height: 25, width: 25 }]} source={require('../assets/Notification.png')} /> */}
        </View>
    )
}


export default CustomHeaderKN