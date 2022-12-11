import React, { useEffect, useRef, useState } from 'react';
import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { format } from 'date-fns'
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage"
import client from '../api/client';
// import { ActivityIndicator } from 'react-native-paper';

import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';
import { id } from 'date-fns/locale';


import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';



const { height, width } = Dimensions.get('window')


const OrdersScreen = ({ navigation }) => {

    const { t, i18n } = useTranslation()

    const monthsList = [`${t('common:monthList.jan')}`,
    `${t('common:monthList.feb')}`,
    `${t('common:monthList.mar')}`,
    `${t('common:monthList.apr')}`,
    `${t('common:monthList.may')}`,
    `${t('common:monthList.jun')}`,
    `${t('common:monthList.july')}`,
    `${t('common:monthList.aug')}`,
    `${t('common:monthList.sept')}`,
    `${t('common:monthList.oct')}`,
    `${t('common:monthList.nov')}`,
    `${t('common:monthList.dec')}`,
    ]

    const [refreshing, setRefreshing] = useState(false);

    const [isLoading, setIsLoading] = useState(true)
    const [isEmptyOrders, setIsEmptyOrders] = useState(false)

    const [orders, setOrders] = useState({})

    const dateFormatter = (res) => {
        let array = res.date.split('-')
        let array2 = array[2].split(' ')
        // console.log(array2[0], monthsList[array[1][1] - 1], array[0])
        return array2[0]
    }

    const fetchApi = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            // const farmer_id = await AsyncStorage.getItem('userId')
            console.log("token", token)
            // console.log("userId", farmer_id)
            const res = await client.get('/order', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log("orders ---- ", res.data.data[0].date)
            setOrders(res.data)
            console.log("res.data.data", res.data.data)
            // res.data.data != '' ? console.log("true"):console.log("false")
            // console.log("Orders --------------------", res.data.data[0].fc.address)

            if (res.data.data == '') {
                setIsEmptyOrders(true)
                console.log("isEmptyOrders", isEmptyOrders)
                console.log("isLoading", isLoading)
            } else if (res.data.message == 'success') {
                setIsLoading(false)
            }
            // console.log("Months List : ------", monthsList[0])
            // console.log(array[0])
            // console.log(array[1])
            // console.log(array2[0])
            // console.log(monthsList[04])
            // setIsLoading(false)

            // var formattedDate = format(res.data.data.date, "MMMM,yyyy ");

            // console.log("formattedDate ---- ",formattedDate);
        } catch (error) {
            console.log(error)
        }

    }

    const onRefresh = () => {
        setRefreshing(true)
        fetchApi()
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
    }

    useEffect(() => {
        fetchApi()
    }, [isEmptyOrders])

    return (
        <ImageBackground style={{ flex: 1, backgroundColor: '#fff' }}>
            <CustomHeader navigation={navigation} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {
                    isLoading
                        ?
                        isEmptyOrders
                            ?
                            <View style={{ justifyContent: 'center', marginBottom: 100 }}>
                                <View style={{ height: 30, marginLeft: 30 }}>
                                    <Text style={{ color: 'rgb(124,124,124)', fontFamily: 'Montserrat Bold', fontSize: 23 }}>
                                        {t('common:orderScreen.orderList')}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    <Text style={{ color: '#000' }}>
                                        No Previous Orders
                                    </Text>
                                </View>
                            </View>
                            :
                            <View style={{ alignSelf: 'center' }}>
                                <CUstomAnimatedLoader />
                            </View>
                        :
                        <ScrollView>
                            <View style={{ justifyContent: 'center', marginBottom: 100 }}>
                                <View style={{ height: 30, marginLeft: 30 }}>
                                    <Text style={{ color: 'rgb(124,124,124)', fontFamily: 'Montserrat Bold', fontSize: 23 }}>
                                        {t('common:orderScreen.orderList')}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    {
                                        orders.message === 'success' && orders.data.length
                                            ?
                                            orders.data.map((item, i) => {
                                                console.log(item)
                                                return (
                                                    <View key={i} style={{ width: width - 50, height: 280, marginBottom: 20, flexDirection: 'row', backgroundColor: 'rgb(245,245,245)', borderRadius: 20 }}>
                                                        <View style={{ flexDirection: 'column', width: width / 3, height: '100%', alignItems: 'center', marginLeft: 10 }}>
                                                            <View style={{ backgroundColor: 'rgb(35,173,116)', marginTop: 10, alignItems: 'center', height: 27, width: '100%', justifyContent: 'center', alignSelf: 'center', borderRadius: 8 }}>
                                                                <Text style={{ color: '#fff', fontFamily: 'Montserrat SemiBold' }}>
                                                                    ₹ {item.price / item.qty} {t('common:orderScreen.perLtr')}
                                                                </Text>
                                                            </View>
                                                            <Image source={require('../assets/Untitled-1-removebg-preview.png')} style={{ height: height / 5, width: width / 5 }} />
                                                        </View>
                                                        <View style={{ flexDirection: 'column', width: 2 * (width / 3) - 50, height: '100%', alignItems: 'center', }}>
                                                            <View style={{ flexDirection: 'row', backgroundColor: 'rgb(35,173,116)', marginTop: 10, alignItems: 'center', height: 27, width: width / 3, justifyContent: 'center', alignSelf: 'flex-end', borderRadius: 8, marginRight: 20 }}>
                                                                <Image source={require('../assets/location-vector.png')} style={{ height: 15, width: 12, marginRight: 10 }} />
                                                                <Text style={{ color: '#fff', fontFamily: 'Montserrat SemiBold' }}>
                                                                    {item.fc.address.split(',')[2]},{item.fc.address.split(',')[0]}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 2 * (width / 3) - 50, height: '85%', flexDirection: 'row', }}>
                                                                <View style={{ width: '5%', height: '100%' }}>
                                                                </View>
                                                                <View style={{ width: '95%', height: '100%', flexDirection: 'column', marginTop: 20 }}>
                                                                    <Text style={{ color: 'rgb(35,173,116)', marginBottom: 8, fontSize: 15, fontFamily: 'Montserrat SemiBold' }}>
                                                                        {item.date.split('-')[2].split(' ')[0]} {monthsList[item.date.split('-')[1][1] - 1]} {item.date.split('-')[0]}
                                                                    </Text>
                                                                    <Text style={{ color: '#000', marginBottom: 8, fontSize: 15, fontFamily: 'Montserrat SemiBold' }}>
                                                                        {t('common:orderScreen.scNum')}:{" "}{item.sc_number}
                                                                    </Text>
                                                                    <Text style={{ color: '#000', marginBottom: 8, fontSize: 15, fontFamily: 'Montserrat SemiBold' }}>
                                                                        {t('common:orderScreen.paymentMode')} : {" "}
                                                                        <Text style={{ color: 'rgb(35,173,116)', fontSize: 15, fontFamily: 'Montserrat SemiBold' }}>
                                                                            {item.status_format}
                                                                        </Text>
                                                                    </Text>
                                                                    <Text style={{ color: '#000', marginBottom: 8, fontSize: 15, fontFamily: 'Montserrat SemiBold' }}>
                                                                        {t('common:orderScreen.quantity')} : {" "} {item.qty}
                                                                    </Text>
                                                                    <Text style={{ color: '#000', marginBottom: 8, fontSize: 15, fontFamily: 'Montserrat SemiBold' }}>
                                                                        {t('common:orderScreen.price')} :
                                                                    </Text>
                                                                    <Text style={{ color: 'rgb(35,173,116)', marginBottom: 8, fontSize: 22, fontFamily: 'Montserrat SemiBold' }}>
                                                                        ₹ {item.price}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </View>
                            </View>
                        </ScrollView>
                }
            </ScrollView>
        </ImageBackground>
    )
}

export default OrdersScreen