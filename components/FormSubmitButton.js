import React from 'react'
import { View, Text, StyleSheet,Dimensions, TextInput, TouchableOpacity } from 'react-native'
// import FormContainer from './FormContainer'

const FormSubmitButton = ({title,onPress,submitting}) => {
    const backgroundColor = submitting ? 'rgba(254,138,53,0.6)' : 'rgba(254,138,53,255)' 
    return (
        <TouchableOpacity onPress={!submitting ? onPress : null} style={[styles.container,{backgroundColor}]}>
            <Text style={{fontSize: 18, color: '#ffffff'}}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: { 
        height: 45,
        borderRadius: 15,
        justifyContent:'center',
        alignItems:'center'
        }
})

export default FormSubmitButton