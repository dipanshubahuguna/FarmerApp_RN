import React, { useEffect, useRef, useState } from 'react';
import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { format } from 'date-fns'
import client from '../api/client';
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from "@react-native-async-storage/async-storage"
// import { ActivityIndicator } from 'react-native-paper';

import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';
import { id } from 'date-fns/locale';


const { height, width } = Dimensions.get('window')

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

const OrdersScreen = ({ navigation }) => {

    const [refreshing, setRefreshing] = useState(false);

    const [isLoading, setIsLoading] = useState(true)

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
            const farmer_id = await AsyncStorage.getItem('userId')
            console.log("token", token)
            console.log("userId", farmer_id)
            const res = await client.get('/order', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log("orders ---- ", res.data.data[0].date)
            setOrders(res.data)
            console.log(res.data)
            if (res.data.message == 'success') {
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
    }, [])

    return (
        <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={{ flex: 1 }}>
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
                        <View style={{ alignSelf: 'center' }}>
                            <CUstomAnimatedLoader />
                        </View>
                        :
                        <ScrollView>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 100 }}>
                                {
                                    orders.message === 'success' && orders.data.length
                                        ?
                                        orders.data.map((item, i) => {
                                            return (

                                                <View key={i} style={{ flexDirection: 'row', height: height / 4, marginTop: 30 }}>
                                                    <View style={{ width: width / 4 }}>
                                                        <Image source={require('../assets/Untitled-1-removebg-preview.png')} style={{ height: height / 4, width: width / 4 }} />
                                                    </View>
                                                    <View style={{ backgroundColor: 'rgba(242,242,242,255)', width: 3 * (width / 4), borderTopLeftRadius: 50, borderBottomLeftRadius: 50 }}>
                                                        <View style={{ backgroundColor: 'rgba(95,166,158,255)', height: 25, width: 90, marginLeft: 40, marginTop: 15, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: '#fff' }}>
                                                                {item.date.split('-')[2].split(' ')[0]} {monthsList[item.date.split('-')[1][1] - 1]} {item.date.split('-')[0]}
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: 25, marginLeft: 40, marginTop: 5 }}>
                                                            <Text style={{ color: '#000' }}>
                                                                SC - {item.sc_number}
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: 25, marginLeft: 40, }}>
                                                            <Text style={{ color: '#000' }}>
                                                                Qty - {item.qty}
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: 25, marginLeft: 40, }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={{ color: '#000' }}>
                                                                    Payment Mode:
                                                                </Text>
                                                                <Text style={{ color: 'rgba(82,191,143,255)', marginLeft: 10 }}>
                                                                    Online
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ backgroundColor: 'rgba(95,166,158,255)', height: 25, width: width / 3.5, marginLeft: (width / 2.5), marginTop: 15, borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ color: '#fff' }}>
                                                                Price : ₹{item.price}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                        :
                                        <Text style={{ color: '#000' }}>
                                            No Previous Orders
                                        </Text>
                                }
                            </View>
                        </ScrollView>
                }
            </ScrollView>
        </ImageBackground>
    )
}

export default OrdersScreen