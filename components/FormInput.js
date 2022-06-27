import React from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native'
// import FormContainer from './FormContainer'

const FormInput = (props) => {

    const { placeholder, title, error } = props
    return (
        <View>
            <View style={{ flexDirection: 'row',justifyContent:'space-between',marginBottom:5}}>
                <Text style={{ fontWeight: '900', color: 'black' }}>{title}</Text>
                {error ? (
                <Text style={{ fontWeight: '400', color: 'red' }}>{error}</Text>
                ):null}
            </View>
                <TextInput
                    {...props}
                    placeholder={placeholder}
                    style={styles.input} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'black',
        height: 35,
        color: 'rgba(37, 124, 122, 1)',
        borderRadius: 15,
        fontSize: 13,
        paddingLeft: 10,
        marginBottom: 20
    }
})

export default FormInput