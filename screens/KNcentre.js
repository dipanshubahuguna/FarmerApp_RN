import React, { Component } from 'react';
import { View,Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import KnowledgeCentre from './KnowledgeCentre';
import Post from './Post';

const Stack = createNativeStackNavigator()

const KNcentre = () =>{
    return(
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="Knowledge" component={KnowledgeCentre} />
            <Stack.Screen name="Post" component={Post} />
        </Stack.Navigator>
    )
}

export default KNcentre