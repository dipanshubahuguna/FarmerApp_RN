import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
// import {  } from 'react-native-gesture-handler'
import client from '../api/client'
import { signIn } from '../api/user'
import { useLogin } from '../context/LoginProvider'
import FormContainer from './FormContainer'
import FormInput from './FormInput'
import FormSubmitButton from './FormSubmitButton'


// const isValidObjField = (obj) => {
//     return Object.values(obj).every(value => value.trim())
// }

// const updateError = (error, stateUpdater) => {
//     stateUpdater(error)
//     setTimeout(() => {
//         stateUpdater('')
//     }, 2500)
// }

const LoginForm = ({ navigation }) => {

    const { setIsLoggedIn, setProfile, onBoard, setOnBoard } = useLogin();

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    })


    const [error, setError] = useState('')

    const updateError = (error, stateUpdater) => {
        stateUpdater(error)
        setTimeout(() => {
            stateUpdater('')
        },2500)
    }

    const { email, password } = userInfo

    const handelOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value })
    }

    // const isValidForm = () => {
    //     if (!isValidObjField(userInfo)) return updateError('Require all Fields', setError)
    //     // if(!email.trim() || email.length != 10 ) return updateError('Wrong email number or password',setError)
    //     if (!password.trim() || password.length < 6) return updateError('Wrong email number or password', setError)
    //     return true
    // }

    const submitForm = async () => {
        {
            try {
                console.log(userInfo.email)
                console.log(userInfo.password)
                const res = await signIn({ email, password })
                // console.log("returned from signIn from user.js ------- ", res.error)
                if (res.message === 'Success') {
                    setUserInfo({ email: '', password: '' })
                    if (res.user.bank == null) {
                        setOnBoard(true)
                        console.log("onBoard", onBoard)
                    }
                    console.log("response in submit form -----123 --------", res.user)
                    setIsLoggedIn(true)
                } else if (res.message == "Invalid Credentials") {
                    setError("Invalid Credentials")
                } else {
                    let e = res.error
                    // console.log(e)
                    const errorArray = e.split(".")
                    console.log("error --- ", errorArray[0])
                    console.log("res.message --- ", res.message)
                    updateError(errorArray[0], setError)
                }
                // console.log(res)
            } catch (error) {
                console.log("error in loginFOrm screen ----- ", error)
            }
        }
    }

    // useEffect(async () => {
    //     const token = await AsyncStorage.getItem('token')
    //     const farmer_id = await AsyncStorage.getItem('userID')
    //     console.log("token :", token)
    //     console.log("farmer_id :", farmer_id)
    // })

    return (
        <FormContainer>
            <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
                {error ? <Text style={{ color: 'red', fontSize: 15, textAlign: 'center', fontFamily: 'Calibri Light' }}>{error}</Text> : null}
                <FormInput value={email} onChangeText={(value) => handelOnChangeText(value, 'email')} title='Email' placeholder='Enter your email' />
                <FormInput secureTextEntry={true} value={password} onChangeText={(value) => handelOnChangeText(value, 'password')} title='Password' placeholder='Enter your password' />
                <FormSubmitButton onPress={submitForm} title='Login' />
                <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => navigation.navigate('PhoneAuth')}>
                    <Text style={{ color: '#000', fontFamily: 'Montserrat Bold', fontSize: 15 }}>
                        Login via OTP
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </FormContainer>
    )
}

const styles = StyleSheet.create({
    container: {}
})

export default LoginForm