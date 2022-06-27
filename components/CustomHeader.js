import React, { Component } from 'react';
import { View, Text, TouchableOpacity,Image,Dimensions } from 'react-native';


const { height, width } = Dimensions.get('window')

const CustomHeader = ({navigation}) => {
    return (
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                <Image style={[{ marginLeft: 20, height: 20, width: 20 }]} source={require('../assets/hamburger_menu_vector.png')} />
            </TouchableOpacity>
            <Image style={[{ marginLeft: width - 100, height: 25, width: 25 }]} source={require('../assets/Notification.png')} />
        </View>
    )
}


export default CustomHeader