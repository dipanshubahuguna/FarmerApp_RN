import React from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Profile from './Profile';
import CustomDrawer from '../components/CustomDrawer';
import MainScreen from './MainScreen';
import OrdersScreen from './Orders';
import SellingCentre from './SellingCentre';
import { useLogin } from '../context/LoginProvider';


import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';
import HelpAndFeedBackScreen from './HelpAndFeedbackScreen';


const { height, width } = Dimensions.get('window')
const Drawer = createDrawerNavigator();

const DrawerSlide = () => {


    const { t, i18n } = useTranslation()

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
            <Drawer.Screen name={t('common:drawerSlide.home')}
                component={SellingCentre}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 20, width: 20 }} source={require('../assets/home.png')} />)
                }} />
            <Drawer.Screen name={t('common:drawerSlide.profile')}
                component={Profile}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 20, width: 20 }} source={require('../assets/profile_vector.png')} />)
                }} />
            <Drawer.Screen name={t('common:drawerSlide.orders')}
                component={OrdersScreen}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 18, width: 20 }} source={require('../assets/list.png')} />)
                }} />
            <Drawer.Screen name={t('common:drawerSlide.helpFeedBack')}
                component={HelpAndFeedBackScreen}
                options={{
                    drawerIcon: ({ color }) => (<Image style={{ height: 18, width: 20 }} source={require('../assets/Help.png')} />)
                }} />
        </Drawer.Navigator>
    )
}

export default DrawerSlide