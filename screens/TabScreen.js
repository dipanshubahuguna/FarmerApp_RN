import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KnowledgeCentre from './KnowledgeCentre';
import SellingCentre from './SellingCentre';
import DrawerSlide from './DrawerSlide';

import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import KNcentre from './KNcentre';

import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator();

const { height, width } = Dimensions.get('window')

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  
  const { t, i18n } = useTranslation()

  let [selected,setSelected] = useState(1)
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 25,
          left: 25,
          borderRadius: 16,
          backgroundColor: 'rgba(9,170,103,1)',
          borderColor: 'rgba(9,170,103,1)',
          borderWidth: 3,
          borderTopWidth: 3,
          borderRightWidth: 3.5,
          borderTopColor: 'rgba(9,170,103,1)',
          elevation: 0
        },
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: {
          fontSize: 13,
          paddingBottom: 15,
          fontFamily: 'Montserrat Bold'
        },
        tabBarActiveTintColor: 'rgba(9,170,103,1)',
        tabBarInactiveTintColor: '#fff',
        tabBarActiveBackgroundColor: '#fff',
        tabBarInActiveBackgroundColor: 'rgba(9,170,103,1)',
        tabBarItemStyle: {
          borderTopLeftRadius: selected == 1 ? 12 : 0,
          borderBottomLeftRadius: selected == 1 ? 12 : 0,
          borderBottomRightRadius: selected == 2 ? 12 : 0,
          borderTopRightRadius: selected == 2 ? 12 : 0,
        }
      }}
    >
      <Tab.Screen
        name={t('common:tabScreen.sellingCenter')}
        component={DrawerSlide}
        listeners={{
          tabPress: () => {
            setSelected(1)
            // console.log(selected)
          },
        }}
      />
      <Tab.Screen
        name={t('common:tabScreen.knowledgeCenter')}
        component={KNcentre}
        listeners={{
          tabPress: () => {
            setSelected(2)
            // console.log(selected)
          },
        }}
      />
    </Tab.Navigator>
  );
}


export default TabScreen
