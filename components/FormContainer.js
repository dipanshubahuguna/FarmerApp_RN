import React from 'react'
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView,ScrollView } from 'react-native'

const FormContainer = ({ children }) => {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
            {children}
        </ScrollView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        width: Dimensions.get('window').width,
    }
})

export default FormContainer