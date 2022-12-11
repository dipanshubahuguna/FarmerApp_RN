import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import client from '../api/client';
import { forceTouchGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/ForceTouchGestureHandler';

import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';

const { height, width } = Dimensions.get('window')

const BankDetails = ({ navigation }) => {

    // let proceedToLottie = false

    const { t, i18n } = useTranslation()

    const [name, setName] = useState();
    const [number, setNumber] = useState();
    const [code, setCode] = useState();
    const [bankName, setBankName] = useState()
    const [proceed, setProceed] = useState(false)
    const [message, setMessage] = useState('')
    const [proceedToLottie, setProceedToLottie] = useState(false)
    const [error, setError] = useState('')
    const [id, setId] = useState('')

    const setUpdater = (value, fieldName) => {
        if (proceed) {
            fieldName(value)
            setTimeout(() => {
                fieldName('')
            }, 2500);
        } else {
            setError(value)
            setTimeout(() => {
                setError('')
            }, 2500);
        }
    }

    const fetchApi = async () => {
        try {
            const farmer_id = await AsyncStorage.getItem('userId')
            const token = await AsyncStorage.getItem('token')
            const bank_details = {
                farmer_id: farmer_id,
                bank_name: bankName,
                ac_number: number,
                ac_holder: name,
                ac_ifsc: code
            }
            const res = await client.post('/bank-detail', bank_details, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data)

            setMessage(res.data.message)

            if (res.data.message == 'fail') {
                setUpdater(`${t('common:bankDetailsScreen.error.accAlreadyExists')}`, setError)
                setProceedToLottie(false)
                // return proceedToLottie
            }

            // if(res.data.message == "Successfuly uploaded"){
            //     proceedToLottie = true
            //     // return proceedToLottie
            // }

            console.log("proceedToLottie", proceedToLottie)
            // let msg = res.data.message
            // return msg
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const res = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data)
            setId(res.data.bank.farmer_id)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser()
        if (message == "Successfuly uploaded") {
            setProceedToLottie(true)
        }
    }, [message])
    return (

        <ImageBackground style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ height: '10%' }}>
            </View>
            <View style={{ height: '10%', alignItems: 'center' }}>
                <Text style={{ fontSize: 21, color: 'black', fontFamily: 'Montserrat Bold' }}>
                    {/* Please upload your bank details */}
                    {t('common:bankDetailsScreen.pleaseUploadBankDetails')}
                </Text>
            </View>
            {
                error
                    ?
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'red', fontFamily: 'Montserrat Bold' }}>
                            {error}
                        </Text>
                    </View>

                    :
                    null
            }
            <View style={{ flexDirection: 'column' }}>
                <View style={styles.button}>
                    <View style={styles.detail}>
                        <TextInput
                            style={{ color: '#000000', fontWeight: '400', marginLeft: (width - 90) / 5, fontFamily: 'Montserrat SemiBold' }}
                            placeholder={t('common:bankDetailsScreen.accHolderName')}
                            value={name}
                            onChangeText={(text) => setName(text)}
                            selectionColor={'grey'}
                        />
                    </View>
                </View>
                <View style={styles.button}>
                    <View style={styles.detail}>
                        <TextInput
                            style={{ color: '#000000', fontWeight: '400', marginLeft: (width - 90) / 5, fontFamily: 'Montserrat SemiBold' }}
                            placeholder={t('common:bankDetailsScreen.accNum')}
                            onChangeText={(text) => setNumber(text)}
                            selectionColor={'grey'}
                            value={number} />
                    </View>
                </View>
                <View style={styles.button}>
                    <View style={styles.detail}>
                        <TextInput
                            style={{ color: '#000000', fontWeight: '400', marginLeft: (width - 90) / 5, fontFamily: 'Montserrat SemiBold' }}
                            placeholder={t('common:bankDetailsScreen.IFSC')}
                            onChangeText={(text) => setCode(text)}
                            selectionColor={'grey'}
                            value={code} />
                    </View>
                </View>
                <View style={styles.button}>
                    <View style={styles.detail}>
                        <TextInput
                            style={{ color: '#000000', fontWeight: '400', marginLeft: (width - 90) / 5, fontFamily: 'Montserrat SemiBold' }}
                            placeholder={t('common:bankDetailsScreen.bankName')}
                            onChangeText={(text) => setBankName(text)}
                            selectionColor={'grey'}
                            value={bankName}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.submit}
                    onPress={() => {
                        // console.log(bankName, code, number, name)
                        if (bankName == null || code == null || number == null || name == null) {
                            setProceed(false)
                            setUpdater(`${t('common:bankDetailsScreen.error.allFieldsMandatory')}`, setError)
                        } else {
                            setProceed(true)
                            fetchApi()
                            // console.log("res",res)
                            if (proceedToLottie) navigation.replace('Lottie2')
                            // console.log(res)
                        }
                    }}
                >
                    <Text style={{ fontSize: 18, color: '#ffffff', fontFamily: 'Montserrat Bold' }}>{
                        proceedToLottie ? `${t('common:bankDetailsScreen.upload')}` : `${t('common:bankDetailsScreen.submit')}`
                    }</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.skip}
                    onPress={() => navigation.replace('ProfileUpload')}
                >
                    <Text style={{ fontSize: 12, color: '#ffffff', fontFamily: 'Montserrat Bold' }}>Skip</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

// navigation.replace('Lottie2',{data:{name,number,code,bankName}})

const styles = StyleSheet.create({
    detail: {
        height: 55,
        width: width - 70,
        borderRadius: 13,
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
        height: 40,
        width: width - 90,
        marginTop: 20,
        marginBottom: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10,
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
        borderRadius: 10,
        backgroundColor: 'rgba(254,138,53,255)'
    },
    skip: {
        height: 30,
        width: width - 350,
        marginTop: 20,
        marginRight: 25,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10,
        backgroundColor: 'rgba(254,138,53,255)'
    }
})


export default BankDetails