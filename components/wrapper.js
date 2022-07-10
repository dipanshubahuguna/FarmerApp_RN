import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native'

const Wrapper = ({ title, backgroundColor, style, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.container, style, {backgroundColor}]}>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: '50%',
    backgroundColor: "#27f5e5",
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Montserrat Black'
  }
})



export default Wrapper