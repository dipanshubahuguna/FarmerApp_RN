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

import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';




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

    const { t, i18n } = useTranslation()
    
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
        }, 2500)
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
                    res.user.bank ?  setOnBoard(false) : setOnBoard(true)
                    console.log("onBoard bank", res.user.bank)
                    console.log("onBoard", onBoard)
                    // if (res.user.bank != null) {
                    //     setOnBoard(false)
                    // }
                    // if(res.user.bank != null){
                    //     setOnBoard(false)
                    //     console.log("onBoard", onBoard)
                    // }
                    console.log("response in submit form -----123 --------", res.user)
                    setIsLoggedIn(true)
                } else if (res.message == "Invalid Credentials") {
                    setError(`${t('common:loginForm.invalidCredentials')}`)
                } else {
                    let e = res.error
                    // console.log(e)
                    const errorArray = e.split(".")
                    console.log("error --- ", errorArray[0])
                    console.log("res.message --- ", res.message)
                    if( errorArray[0] === "The email must be a valid email address"){
                        updateError(`${t('common:loginForm.invalidCredentials')}`, setError)
                    }
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
                {error ? Alert.alert('Invalid Credentials') : null}
                <FormInput value={email} onChangeText={(value) => handelOnChangeText(value, 'email')} title={t('common:loginForm.email')} placeholder={t('common:loginForm.enterEmail')} />
                <FormInput secureTextEntry={true} value={password} onChangeText={(value) => handelOnChangeText(value, 'password')} title={t('common:loginForm.password')} placeholder={t('common:loginForm.enterPassword')} />
                <FormSubmitButton onPress={submitForm} title={t('common:loginForm.login')} />
                <TouchableOpacity style={{ marginTop: 30, alignItems: 'center' }} onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={{ color: '#000', fontFamily: 'Montserrat Bold', fontSize: 15 }}>
                        Forgot Password ?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => navigation.navigate('PhoneAuth')}>
                    <Text style={{ color: '#000', fontFamily: 'Montserrat Bold', fontSize: 15 }}>
                        {t('common:loginForm.loginViaOTP')}
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