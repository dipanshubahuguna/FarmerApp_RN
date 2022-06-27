import React from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native'
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList, DrawerItem  } from "@react-navigation/drawer";
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Profile from './Profile';
import CustomDrawer from '../components/CustomDrawer';
import MainScreen from './MainScreen';
import OrdersScreen from './Orders';
import SellingCentre from './SellingCentre';
import { useLogin } from '../context/LoginProvider';


const { height, width } = Dimensions.get('window')
const Drawer = createDrawerNavigator();

const DrawerSlide = () => {

    const { setIsLoggedIn, profile } = useLogin();
    return (
        <Drawer.Navigator initialRouteName="Home"
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: 'rgba(9,170,103,255)',
                drawerActiveTintColor: '#ffffff',
                drawerLabelStyle: {
                    fontFamily: 'Montserrat Bold',
                    fontSize: 15,

                }
            }}>
            <Drawer.Screen name="Home"
                component={SellingCentre}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 20, width: 20 }} source={require('../assets/home.png')} />)
                }} />
            <Drawer.Screen name="Profile"
                component={Profile}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 20, width: 20 }} source={require('../assets/profile_vector.png')} />)
                }} />
            <Drawer.Screen name="Orders"
                component={OrdersScreen}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 18, width: 20 }} source={require('../assets/list.png')} />)
                }} />
            </Drawer.Navigator>
    )
}

export default DrawerSlide