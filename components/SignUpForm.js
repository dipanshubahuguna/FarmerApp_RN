import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, KeyboardAvoidingView } from 'react-native'
import FormContainer from './FormContainer'
import FormInput from './FormInput'
import FormSubmitButton from './FormSubmitButton'
import { StackActions } from '@react-navigation/native'
import axios from 'axios'
import client from '../api/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { signIn } from '../api/user'
import CustomLottie from './CustomLottie'

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

// const validationSchema = Yup.object({
//     username: Yup.string()
//         .trim()
//         .min(3, 'Invalid name!')
//         .required('Name is required!'),
//     phone: Yup.number().min(10, 'Phone number must be of 10 digits!').required('Phone number is required!'),
//     password: Yup.string()
//         .trim()
//         .min(6, 'Password is too short!')
//         .required('Password is required!'),
//     confirmPassword: Yup.string().equals(
//         [Yup.ref('password'), null],
//         'Password does not match!'
//     ),
// });

const SignUpForm = ({ navigation }) => {

    const { t, i18n } = useTranslation()

    const [userInfo, setUserInfo] = useState({
        name: '',
        phone: '',
        email: '',
        lang: 'en',
        password: ''
    })

    const [error, setError] = useState("")
    const [isError, setIsError] = useState(false)
    const [registered, setRegistered] = useState(false)

    const { name, phone, email, lang, password } = userInfo

    const handelOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value })
    }

    const updateError = (error, stateUpdater) => {
        stateUpdater(error)
        setTimeout(() => {
            stateUpdater('')
        }, 2500)
    }



    // const isValidForm = () => {
    //     if (!isValidObjField(userInfo)) return updateError('Require all Fields', setError)
    //     if (!username.trim() || username.length < 3) return updateError('Invalid name!', setError)
    //     if (!phone.trim() || phone.length != 10) return updateError('Enter 10 digit phone number', setError)
    //     if (!password.trim() || password.length < 6) return updateError('Password must be 6 characters long!', setError)
    //     if (password !== confirmPassword) return updateError('Both Passwords must be same', setError)
    //     return true
    // }


    const signUp = async () => {
        const register = {
            name: userInfo.name,
            phone: userInfo.phone,
            email: userInfo.email,
            lang: "en",
            password: userInfo.password
        }
        console.log(register)

        try {
            const res = await axios.post('http://printrly.com/public/api/user_register', register)
            console.log("res message", res.data.message)
            console.log("res error", res.data.error)
            if (res.data.message == 'fail') {
                // const noError = ' '
                let e = res.data.error
                console.log(e)
                const errorArray = e.split(".")
                console.log(errorArray[0])
                if (errorArray[0] === "The name field is required") updateError(`${t('common:signUpForm.errors.nameField')}`, setError)
                if (errorArray[0] === "The phone field is required" || errorArray[0] === "The phone must be at least 10  characters") updateError(`${t('common:signUpForm.errors.phoneAlreadyTaken')}`, setError)
                if (errorArray[0] === "The phone has already been taken") updateError(`${t('common:signUpForm.errors.phoneAlreadyTaken')}`, setError)
                if (errorArray[0] === "The email has already been taken") updateError(`${t('common:signUpForm.errors.emailField')}`, setError)
                if (errorArray[0] === "The password field is required") updateError(`${t('common:signUpForm.errors.passwordField')}`, setError)
                if (errorArray[0] === "The password must be at least 8 characters") updateError(`${t('common:signUpForm.errors.pass8Char')}`, setError)
                // setIsError(true)
            }
            // setTimeout(() => {
            //     setIsError(false)
            // },[1000])
            // console.log(typeof noError)
            if (res.data.message === 'success') {
                setUserInfo({
                    name: '',
                    phone: '',
                    email: '',
                    lang: 'en',
                    password: ''
                })
                setRegistered(true)
                setError("")
            }
        } catch (error) {
            console.log(error)
        }

        // const res = await client.post('/create-user', {
        //     ...values
        // })
        // // console.log('res.data.success :',res.data.success)
        // // console.log('res.data.message :',res.data.message)
        // Alert.alert(res.data.message)
        // if (res.data.success) {
        //     const signInRes = await signIn(values.email, values.password)
        //     console.log('signInRes.data.success :', signInRes)
        //     if (signInRes.success) {
        //         navigation.dispatch(
        //             StackActions.replace('InUpScreen', {
        //                 token: signInRes.token
        //             })
        //         )
        //         // console.log('signInRes.data')
        //     }
        // }
        // // formikActions.resetForm()
        // // formikActions.setSubmitting(false)
    }


    return (
        <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
            <View style={{marginBottom:100}}>
                <FormContainer>
                    {/* <CustomLottie /> */}
                    {registered && !error
                        ?
                        Alert.alert('Farmer is registered. You can Login now!')
                        :
                        null}
                    {error && !registered
                        ?
                        Alert.alert(`${error}`)
                        :
                        null}
                    <FormInput value={name} onChangeText={(value) => handelOnChangeText(value, 'name')} title={t('common:signUpForm.userName')} placeholder={t('common:signUpForm.enterName')} />
                    <FormInput value={phone} onChangeText={(value) => handelOnChangeText(value, 'phone')} title={t('common:signUpForm.phoneNum')} placeholder={t('common:signUpForm.enterPhoneNum')} />
                    <FormInput value={email} onChangeText={(value) => handelOnChangeText(value, 'email')} title={t('common:signUpForm.email')} placeholder={t('common:signUpForm.enterEmail')} />
                    <FormInput secureTextEntry={true} value={password} onChangeText={(value) => handelOnChangeText(value, 'password')} autoCapitalize='none' title={t('common:signUpForm.password')} placeholder={t('common:signUpForm.enterPassword')} />
                    <FormSubmitButton onPress={signUp} title={t('common:signUpForm.register')} />
                </FormContainer>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {}
})

export default SignUpForm