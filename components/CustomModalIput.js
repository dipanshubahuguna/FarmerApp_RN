import React, { Component } from 'react';
import { View, Text,StyleSheet,TextInput } from 'react-native';

const CustomModalInput = ({value}) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',paddingBottom:20 }}>
            <View style={{ width: '40%' }}>
                <Text style={{ color: '#000' }}>
                    {value}
                </Text>
            </View>
            <View style={{ width: '40%' }}>
                <TextInput style={styles.input} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
    }
})

export default CustomModalInput