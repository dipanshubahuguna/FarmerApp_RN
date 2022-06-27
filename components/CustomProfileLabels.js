import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';

const { height, width } = Dimensions.get('window')

const CustomProfileLabels = ({ title, value }) => {

    return (
        <View style={styles.outer}>
            <View style={styles.inner}>
                <Text style={{ color: '#ffffff', alignSelf: 'center', paddingTop: 10, fontWeight: 'bold' }}>
                    {title}
                </Text>
            </View>
            <View style={styles.middle}>
                <TextInput
                    editable={false}
                    style={{ color: '#ffffff', paddingLeft: 20, fontWeight: 'bold' }}
                    placeholder={value} placeholderTextColor={'#fff'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outer: {
        backgroundColor: '#FF9A17',
        flexDirection: 'row',
        borderRadius: 40,
        height: 45,
        width: width - 90,
        marginBottom: 20,
        alignSelf: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
        // position: 'relative'
    },
    inner: {
        backgroundColor: 'rgba(10,171,104,255)',
        borderRadius: 40,
        width: '30%',
        // marginRight: width - 270,
        // alignItems: 'flex-start'
    },
    middle: {
        alignSelf: 'center',
        width: '60%'
    },
    end: {
        alignSelf: 'center',
        width: '60%'
    }
})



export default CustomProfileLabels