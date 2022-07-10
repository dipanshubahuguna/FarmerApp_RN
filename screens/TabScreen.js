import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KnowledgeCentre from './KnowledgeCentre';
import SellingCentre from './SellingCentre';
import DrawerSlide from './DrawerSlide';

import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import KNcentre from './KNcentre';

const Drawer = createDrawerNavigator();

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarStyle: {
        height: 50,
        position: 'absolute',
        bottom: 16,
        right: 16,
        left: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(9,170,103,1)'
      },
      tabBarIconStyle: { display: "none" },
      tabBarLabelStyle: {
        fontSize: 13,
        paddingBottom: 15,
        fontFamily: 'Montserrat Bold'
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'rgba(0,0,0,0.6)',
    }}
    >
      <Tab.Screen
        name="SellingCentre"
        component={DrawerSlide}
      />
      <Tab.Screen
        name="Knowledge Centre"
        component={KNcentre}/>
    </Tab.Navigator>
  );
}


export default TabScreen
