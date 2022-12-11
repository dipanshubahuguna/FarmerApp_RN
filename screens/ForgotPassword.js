import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Dimensions, Alert } from 'react-native';
import client from '../api/client';
import FormContainer from '../components/FormContainer';
import FormInput from '../components/FormInput';
import FormSubmitButton from '../components/FormSubmitButton';

const { height, width } = Dimensions.get('window')


const ForgotPassword = ({navigation}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [OTP, setOTP] = useState('')
    const [proceed, setProceed] = useState(false)
    const [token, setToken] = useState('')


    const verifyPassword = () => {
        console.log(token)
        return password == confirmPassword && password.length == 8 ? true : false
    }

    const validEmail = async () => {
        try {
            const res = await client.post('/forget/request', { email: email })
            console.log(res.data)
            if (res.data.message == "fail") {
                Alert.alert('Email is Invalid or Not Registered') 
            }else{
                setToken(res.data.data.token)
                setProceed(true)
            }

            // res.data.message == "success" ?: setProceed(false)
        } catch (error) {
            console.log("Error in validEmail func", error)
        }
    }
    
    const verifyOTP = async () => {
        try {
            const res = await client.post('/forget/verify',{token,otp:OTP,password})
            console.log(res.data)
            if(res.data.status == "success")
            {
                Alert.alert('Password Changed Successfully')
                navigation.replace('InUpScreen')
            }else{
                Alert.alert('OTP Invalid')
            }
        } catch (error) {
            console.log("Error in verifyOTP func", error)
        }
    }

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/logo_150x100.png')} />
            </View>
            <View style={{ padding: 20 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Forgot Password ?
                    </Text>
                </View>
            </View>

            {
                proceed
                    ?
                    <FormContainer>
                        <FormInput secureTextEntry={true} value={password} onChangeText={(value) => setPassword(value)} title='New Password' placeholder='Enter new Password' />
                        <FormInput secureTextEntry={true} value={confirmPassword} onChangeText={(value) => setConfirmPassword(value)} title='Confirm Password' placeholder='Confirm your new Password' />
                        <FormInput value={OTP} onChangeText={(value) => setOTP(value)} title='OTP' placeholder='Enter OTP' />
                        <FormSubmitButton onPress={() => {
                            console.log(email)
                            // console.log(validPhoneNum())
                            // console.log(password)
                            // console.log(confirmPassword)
                            verifyPassword() ? verifyOTP(): Alert.alert('Password Not Matched or Password Less than 8 characters')
                            // console.log("success -----/////",success)
                            // success == 'success' ? setOTPScreen(true) : setOTPScreen(false)
                            // setOTPScreen(true)
                        }} title="Change Password" />
                    </FormContainer>
                    :
                    <FormContainer>
                        <FormInput value={email} onChangeText={(value) => setEmail(value)} title='Email' placeholder='Enter your Email' />
                        <FormSubmitButton onPress={() => {
                            console.log(email)
                            // console.log(validPhoneNum())
                            validEmail()
                            // console.log("success -----/////",success)
                            // success == 'success' ? setOTPScreen(true) : setOTPScreen(false)
                            // setOTPScreen(true)
                        }} title="Proceed" />
                    </FormContainer>
            }
        </View>
    )
}

export default ForgotPassword

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