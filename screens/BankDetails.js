import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler';


const { height, width } = Dimensions.get('window')

const BankDetails = ({ navigation }) => {


    const [name, setName] = useState();
    const [number, setNumber] = useState();
    const [code, setCode] = useState();
    const [bankName, setBankName] = useState()
    const [proceed, setProceed] = useState(false)
    return (
        
            <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={{ flex: 1 }}>
                <View style={{ height: '10%' }}>
                </View>
                <View style={{ height: '10%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 23, color: 'black' }}>
                        Please upload your bank details
                    </Text>
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <View style={styles.button}>
                        <View style={styles.detail}>
                            <TextInput
                                style={{ color: '#000000', fontWeight: '400',marginLeft:(width - 90)/5}}
                                placeholder="Enter Account Holder name"
                                value={name}
                                onChangeText={(text) => setName(text)}
                                selectionColor={'grey'}
                            />
                        </View>
                    </View>
                    <View style={styles.button}>
                        <View style={styles.detail}>
                            <TextInput
                                style={{ color: '#000000', fontWeight: '400',marginLeft:(width - 90)/5}}
                                placeholder="Enter Account Number"
                                onChangeText={(text) => setNumber(text)}
                                selectionColor={'grey'}
                                value={number} />
                        </View>
                    </View>
                    <View style={styles.button}>
                        <View style={styles.detail}>
                            <TextInput
                                style={{ color: '#000000', fontWeight: '400',marginLeft:(width - 90)/5}}
                                placeholder="Enter IFSC Code"
                                onChangeText={(text) => setCode(text)}
                                selectionColor={'grey'}
                                value={code} />
                        </View>
                    </View>
                    <View style={styles.button}>
                        <View style={styles.detail}>
                            <TextInput
                                style={{ color: '#000000', fontWeight: '400',marginLeft:(width - 90)/5}}
                                placeholder="Enter Bank Name"
                                onChangeText={(text) => setBankName(text)}
                                selectionColor={'grey'}
                                value={bankName}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.submit}
                        onPress={() => {
                            !(bankName == null || code == null || number == null || name == null) ? navigation.replace('Lottie2', { data: { name, number, code, bankName } }) : Alert.alert('Fill all details Please')
                        }}
                    >
                        <Text style={{ fontSize: 18, color: '#ffffff' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
    )
}

// navigation.replace('Lottie2',{data:{name,number,code,bankName}})

const styles = StyleSheet.create({
    detail: {
        height: 55,
        width: width - 50,
        borderRadius: 63,
        borderWidth: 1,
        color: 'green',
        borderColor: "#000000",
        marginBottom: 10,
        position: 'absolute',
        marginLeft: 40,
    },
    profile: {
        marginLeft: 80,
    },
    feed: {
        marginLeft: 20,
        marginTop: 10,
    },
    button: {
        height: 35,
        width: width - 90,
        marginTop: 20,
        marginBottom: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 40,
        backgroundColor: 'rgba(255,168,29,255)'
    },
    submit: {
        height: 45,
        width: width - 50,
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 18,
        backgroundColor: 'rgba(231,105,29,255)'
    }
})


export default BankDetails