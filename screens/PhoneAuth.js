import React, { Component, createRef, useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import client from '../api/client';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import FormSubmitButton from '../components/FormSubmitButton';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLogin } from '../context/LoginProvider';


const { height, width } = Dimensions.get('window')

const PhoneAuth = ({ navigation }) => {


    const { setIsLoggedIn, setProfile, onBoard, setOnBoard } = useLogin();

    const [phoneNumber, setPhoneNumber] = useState('')
    const [OTPScreen, setOTPScreen] = useState(false)
    const [error, setError] = useState('')
    const [TOKEN, setTOKEN] = useState('')
    const [OTP, setOTP] = useState('')
    const [PIN, setPIN] = useState('')
    const [success, setSuccess] = useState('')
    const [validPhoneNumResponse, setValidPhoneNumResponse] = useState({})
    const [validOTPResponse, setValidOTPResponse] = useState({})

    const [timer, setTimer] = useState(10)

    const [pin1, setPin1] = useState("")
    const [pin2, setPin2] = useState("")
    const [pin3, setPin3] = useState("")
    const [pin4, setPin4] = useState("")

    const pin1ref = createRef()
    const pin2ref = createRef()
    const pin3ref = createRef()
    const pin4ref = createRef()

    const updateError = (error, stateUpdater) => {
        stateUpdater(error)
        setTimeout(() => {
            stateUpdater('')
        }, 2500);
    }

    const set_PIN = (PIN) => {
        return setPIN(PIN)
    }

    let count = timer

    const makeTimer = () => {
        setInterval(() => {
            if (count > 0) {
                count--
                setTimer(count)
                console.log("timer", count)
            }
        }, 1000);
    }

    // const handleKeyPress = (pinVal,{ nativeEvent: { key: keyValue } }) =>{
    //     if (keyValue === 'Backspace'){
    //         // this.refs.refOfPreviousInput.focus();
    //         console.log(`${keyValue} ----- ${pinVal}`)
    //     }
    // }


    const validPhoneNum = async () => {
        try {
            const res = await client.post('/otp/gen', { phone: phoneNumber })
            console.log(res.data)
            setValidPhoneNumResponse(res.data)
            // setState(res.data.message,setSuccess)

            // if (success == "fail") {
            //     updateError('Please enter a valid Phone Number', setError)
            //     console.log("entered in fail if statement")
            //     // console.log("success in fail if condition",success)
            //     // setSuccess(res.data.message)
            //     // return false
            // }

            // // console.log(res.data.message)

            // if (success == "success") {
            //     console.log("entered in success if statement")
            //     // console.log(res.data.data.token)
            //     // console.log(res.data.data.otp)
            //     // let tok = res.data.data.token
            //     // let oottpp = res.data.data.otp
            //     setTOKEN(res.data.data.token)
            //     setOTP(res.data.data.otp)
            //     console.log(TOKEN, OTP)
            //     setSuccess(res.data.message)
            //     console.log("success",success)
            //     // return true
            // }
        } catch (error) {
            console.log(error)
        }
    }

    const validOTP = async () => {
        try {
            const res = await client.post('/otp/verify', { otp: PIN, token: TOKEN })
            setValidOTPResponse(res.data)
            console.log("User via OTP login ---- ",res.data)
            if (res.data.message == "Success") {
                let token = res.data.token
                console.log('token after verifying-----', token)
                await AsyncStorage.setItem('token', token)
                let userID = res.data.user.id.toString()
                await AsyncStorage.setItem('userID', userID)
                console.log("userID ................................./////////////////////////...............",userID)
                if (res.data.user.kyc == null) {
                    setOnBoard(true)
                    console.log("onBoard", onBoard)
                }
                console.log("response././..", res.data.user)
                setIsLoggedIn(true)
            } else {
                updateError('Please enter a valid OTP', setError)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("inside useEffect hook")
        console.log(validPhoneNumResponse)
        setSuccess(validPhoneNumResponse.message)
        if (validPhoneNumResponse) {
            if (validPhoneNumResponse.message == 'fail') {
                // setSuccess('fail')
                setOTPScreen(false)
                updateError('Please enter a valid Phone Number', setError)
            }
            if (validPhoneNumResponse.message == 'success') {
                // setSuccess('success')
                setOTPScreen(true)
                setTOKEN(validPhoneNumResponse.data.token)
                setOTP(validPhoneNumResponse.data.otp)
                console.log("TOKEN---", TOKEN, "OTP---", OTP)
            }
        }

        if (OTPScreen == true) {
            makeTimer()
            console.log("timer -- ", count)
        }
        console.log("success in hook", success)
    }, [validPhoneNumResponse, TOKEN, OTP, success])


    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/logo_150x100.png')} />
            </View>
            <View style={{ padding: 20 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        OTP Login
                    </Text>
                </View>
            </View>
            <FormContainer>
                <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
                    {
                        OTPScreen
                            ?
                            <View>
                                {/* <FormInput value={OTP} onChangeText={(value) => setOTP(value)} title='OTP' placeholder='Enter OTP' /> */}
                                {error ? <Text style={{ color: 'red', fontSize: 15, textAlign: 'center', fontFamily: 'Calibri Light' }}>{error}</Text> : null}
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20, paddingTop: 20 }}>
                                    <TextInput
                                        maxLength={1}
                                        autoFocus={true}
                                        value={pin1}
                                        onChangeText={(pin1) => {
                                            setPin1(pin1)
                                            // console.log(pin1)
                                            pin1 ? pin2ref.current.focus() : null
                                        }}
                                        ref={pin1ref}
                                        // onKeyPress={(pin1) => handleKeyPress(pin1)}
                                        keyboardType="numeric"
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderColor: '#000',
                                            borderWidth: 1,
                                            borderRadius: 5,
                                            marginLeft: 20,
                                            color: '#000',
                                            textAlign: 'center'
                                        }} />
                                    <TextInput maxLength={1} ref={pin2ref} value={pin2} onChangeText={(pin2) => {
                                        setPin2(pin2)
                                        // console.log(pin2)
                                        pin2 ? pin3ref.current.focus() : null
                                    }}
                                        // onKeyPress={(pin1) => handleKeyPress(pin1)}
                                        keyboardType="numeric"
                                        style={{ height: 50, width: 50, borderColor: '#000', borderWidth: 1, borderRadius: 5, marginLeft: 20, color: '#000', textAlign: 'center' }} />
                                    <TextInput maxLength={1} ref={pin3ref} value={pin3} onChangeText={(pin3) => {
                                        setPin3(pin3)
                                        // console.log(pin3)
                                        pin3 ? pin4ref.current.focus() : null
                                    }}
                                        // onKeyPress={(pin2) => handleKeyPress(pin2)}
                                        keyboardType="numeric"
                                        style={{ height: 50, width: 50, borderColor: '#000', borderWidth: 1, borderRadius: 5, marginLeft: 20, color: '#000', textAlign: 'center' }} />
                                    <TextInput maxLength={1} ref={pin4ref} value={pin4} onChangeText={(pin4) => {
                                        setPin4(pin4)
                                        // let collectedPIn = pin1+pin2+pin3+pin4
                                        set_PIN(pin1 + pin2 + pin3 + pin4)
                                        // console.log(pin4)
                                        // console.log(PIN)
                                    }}
                                        // onKeyPress={handleKeyPress}
                                        keyboardType="numeric"
                                        style={{ height: 50, width: 50, borderColor: '#000', borderWidth: 1, borderRadius: 5, marginLeft: 20, color: '#000', textAlign: 'center' }} />
                                </View>
                                <FormSubmitButton
                                    title="Verify"
                                    onPress={() => {
                                        // console.log(PIN)
                                        // console.log(OTP)
                                        // console.log(TOKEN)
                                        validOTP()
                                    }}
                                />
                                <View style={{ flexDirection: 'row', padding: 20 }}>
                                    <View style={{ width: '40%', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                            setOTPScreen(false)
                                            setPin1('')
                                            setPin2('')
                                            setPin3('')
                                            setPin4('')
                                            set_PIN('')
                                        }}>
                                            <Text style={{ color: '#000', fontFamily: 'Montserrat Regular', fontSize: 16 }}>
                                                Change Number
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '20%' }}>

                                    </View>
                                    <View style={{ width: '40%', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            disabled={count == 0 ? false : true}
                                            onPress={() => {
                                                validPhoneNum()
                                                setPin1('')
                                                setPin2('')
                                                setPin3('')
                                                setPin4('')
                                                set_PIN('')
                                                pin1ref.current.focus()
                                                setTimer(10)
                                            }}>
                                            <Text style={{ color: '#000', fontFamily: 'Montserrat Regular', fontSize: 16 }}>
                                                Resend OTP ({timer})
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            :
                            <>
                                {error ? <Text style={{ color: 'red', fontSize: 15, textAlign: 'center', fontFamily: 'Calibri Light', paddingBottom: 20 }}>{error}</Text> : null}
                                <FormInput value={phoneNumber} onChangeText={(value) => setPhoneNumber(value)} title='Phone Number' placeholder='Enter your Phone Number' />
                                <FormSubmitButton onPress={() => {
                                    console.log(phoneNumber)
                                    // console.log(validPhoneNum())
                                    validPhoneNum()
                                    // console.log("success -----/////",success)
                                    // success == 'success' ? setOTPScreen(true) : setOTPScreen(false)
                                    // setOTPScreen(true)
                                }} title='Generate OTP' />
                            </>
                    }
                </ScrollView>
            </FormContainer>
        </View>
    )
}

export default PhoneAuth

const styles = StyleSheet.create({
    container: {
        height: 45,
        width: width - 40,
        backgroundColor: "rgba(254,138,53,1)",
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
    },
    title: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Montserrat Black'
    }
})