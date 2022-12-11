import React, { useEffect, useState, useRef, cloneElement } from 'react'
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import client from '../api/client';
import { signOut } from '../api/user';
import CustomHeader from '../components/CustomHeader';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';
import Geolocation from '@react-native-community/geolocation';


import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';

import LottieView from 'lottie-react-native';
import Graph from './graph';


const { height, width } = Dimensions.get('window')

const DATA = [
    { x: new Date(2022, 11, 21), y: 1600 },
    { x: new Date(2022, 11, 20), y: 1600 },
    { x: new Date(2022, 11, 19), y: 1600 },
    { x: new Date(2022, 11, 18), y: 1600 },
    { x: new Date(2022, 11, 17), y: 1600 },
    { x: new Date(2022, 11, 16), y: 1600 },
];

const monthsDict = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
}

var dict = {}

const monthsDict2 = {
    'January': 1,
    'February': 2,
    'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
}

const dataToSend = [...DATA].reverse()
// console.log("dataToSend---------", dataToSend)



const MainScreen = ({ navigation }) => {

    let [graphData, setGraphData] = useState([])
    let hourNow = new Date().getHours()

    let dateNow = new Date().getDate()
    let monthNow = new Date().getMonth() + 1
    let yearNow = new Date().getFullYear()

    const validDateArray = []

    const dateInMonthDict = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    }

    let dataForGraph = []
    for (let i = 0; i < 6; ++i) {
        console.log(dataToSend[i].x, " ", dataToSend[i].y)
        let date = dataToSend[i].x
        // console.log(String(date).split(" ")[3])
        // console.log(monthsDict[String(date).split(" ")[1]])
        // console.log(String(date).split(" ")[2])
        // console.log(date.split(''))
        dataForGraph.push({ x: new Date(String(date).split(" ")[3], monthsDict[String(date).split(" ")[1]], String(date).split(" ")[2]), y: dataToSend[i].y })
    }

    console.log(dataForGraph)

    for (let i = 0; i < 6; ++i) {
        if (validDateArray.length <= 6) {
            let currDate = dateNow
            let currMonth = monthNow
            let currYear = yearNow
            if (dateNow - i > 0) currDate = dateNow - i;
            else if (dateNow - i <= 0) {
                if (monthNow - 1 > 0) {
                    currMonth = monthNow - 1;
                    currDate = dateInMonthDict[currMonth] - Math.abs(dateNow - i);
                }
                else if (monthNow - 1 <= 0) {
                    currMonth = 12;
                    currDate = dateInMonthDict[currMonth] - Math.abs(dateNow - i);
                    currYear = yearNow - 1;
                }
            }
            validDateArray.push(
                new Date(currYear, currMonth, currDate)
            )
            console.log("currMonth -------", currMonth)
            console.log("currDate -------", currDate)
            console.log("monthNow -------", monthNow)
        } else {
            break;
        }
    }

    let dateArray2 = []

    graphData.map((item, i) => {
        // console.log(i,item)
        console.log("split2")
        console.log(i)
        const d = (item.x).split("-")
        console.log(d)
        let month = monthsDict2[d[0].split(" ")[1]]
        let date = d[0].split(" ")[2]
        let year = d[0].split(" ")[3]
        // console.log(month,date,year)
        dict[new Date(year, month, date)] = item.y
        dateArray2.push({ year, month, date })

    })

    const { t, i18n } = useTranslation()

    const selectedLanguageCode = i18n.language

    const languages = [
        { code: "en", label: 'english' },
        { code: "hin", label: 'हिन्दी' }
    ]


    const setLanguage = (code) => {
        console.log(code)
        return i18n.changeLanguage(code)
    }

    // console.log("validDateArray ---------",validDateArray)

    // console.log(" Date Now ----", dateNow)
    // console.log(" Month Now ----", monthNow)
    // console.log(" Year Now ----", yearNow)

    // console.log("dateData ---------",dateData)


    const animationRef = useRef()


    useEffect(() => {
        animationRef.current?.play();
        // getWeather()
    });
    const [daySell, setDaySell] = useState([])

    const [user, setUser] = useState()
    const [phone, setPhone] = useState()
    const [imageProfile, setImageProfile] = useState('')
    const [toggleRead, setToggleRead] = useState(false)
    const [languageDrop, setLanguageDrop] = useState(false)

    const fetchApiUser = async () => {

        const token = await AsyncStorage.getItem('token')
        try {
            const user = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("User Profile ---- in mainScreen", user.data)
            setUser(user.data.name)
            setPhone(user.data.phone)
            if (user.data.kyc != null) {
                setImageProfile(user.data.kyc.photo)
            }
        } catch (error) {
            console.log("error in main screen (fetchApiUser) --", error)
        }
    }

    const fetchApiDaySell = async () => {
        const token = await AsyncStorage.getItem('token')
        try {
            // console.log("reached /user")
            const res = await client.get('/day-selling', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            const resGraph = await client.get('/day-selling-graph', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("resGraph.data ................................ resGraph.data", resGraph.data.data)

            setGraphData(resGraph.data.data)


            // console.log("Market Rates ---- in mainScreen", res.data.data)
            // await res.data.data.map((item, i) => {
            //     // key={i}
            //     const d = String(item.date).split("-")
            //     // console.log(d)
            //     let date = d[2]
            //     let month = d[1]
            //     let year = d[0]
            //     // DATA.push({x:new Date(year,month,date),y:item.price})
            //     let newData = { x: new Date(year, month, date), y: item.price }
            //     setGraphData((prevState) => { return [...prevState, newData] })

            //     // console.log(new Date(year,month,date))

            //     // console.log(item.date, item.price, i)
            // })
            // console.log("graphData in mainScreen.js---------", graphData.reverse())
            // console.log("User Detail ---- in mainScreen", user.data.name)
            // console.log("User Detail ---- in mainScreen", user.data.phone)
            // console.log("User Detail ---- in mainScreen", user.data.kyc.photo)
            setDaySell(res.data.data)
            // res.data.data.map((item,i) => {
            //     let dateArr = item.date.split('-') 
            //     // console.log(item.date.split('-'),i);
            //     console.log(item.price)
            //     dataForGraph.push({x : new Date(dateArr[0],dateArr[1],dateArr[2]),y:item.price})
            // })

        } catch (error) {
            console.log("error in main screen -- (fetchApiDaySell) ", error)
        }

        //     const user = await client.get('/user', {
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }
        //     })

        //     console.log("/user route data ------ ", user.data)
        //     console.log("/user route data ------ ", res_sell.data.data)
        // console.log("/user route data ------ ", user)
        //     setUser(res.data)
        //     // setUser("res in /user route in mainscreen.js",res)
        //     setSelling(res_sell.data.data)
    }

    useEffect(() => {
        fetchApiDaySell()
        fetchApiUser()
    }, [])

    return (
        <ImageBackground style={{ flex: 1, backgroundColor: '#fff', }}>
            {
                !(user && phone)
                    ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                                <Image style={[{ marginLeft: 20, height: 40, width: 40 }]} source={require('../assets/hamburger_menu_vector.png')} />
                            </TouchableOpacity>
                        </View>
                        <CUstomAnimatedLoader />
                    </View>
                    :
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled={true}
                    >
                        {/* <MyDrawer/> */}
                        <View style={{ marginBottom: 200 }}>
                            <View>
                                <View style={{ height: languageDrop ? 260 : 220, width: width, }}>
                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                                            <Image style={[{ marginLeft: 20, height: 40, width: 40 }]} source={require('../assets/hamburger_menu_vector.png')} />
                                        </TouchableOpacity>
                                        <View style={{ marginLeft: '55%' }}>
                                            {
                                                imageProfile
                                                    ?
                                                    <Image style={[styles.avatar]} source={{ uri: imageProfile }} />
                                                    :
                                                    <Image style={[styles.avatar]} source={require('../assets/Dp.png')} />
                                            }
                                        </View>
                                    </View>
                                    {/* <CustomHeader navigation={navigation}/> */}
                                    {/* borderWidth: 2, borderColor: '#000', */}
                                    <View style={{ marginLeft: 25, marginTop: 30 }}>
                                        <Text style={{
                                            marginTop: 5,
                                            color: 'rgb(120,120,120)',
                                            fontSize: 20,
                                            fontFamily: 'Montserrat Bold'
                                        }}>{t('common:mainScreen.hey')}, {user}</Text>
                                        <Text style={{
                                            fontWeight: '600',
                                            color: '#000000',
                                            fontFamily: 'Montserrat Bold',
                                            fontSize: 23
                                        }}>{
                                                hourNow >= 0
                                                    ?
                                                    hourNow <= 11
                                                        ?
                                                        t('common:mainScreen.goodMorning')
                                                        :
                                                        hourNow <= 17
                                                            ?
                                                            t('common:mainScreen.goodAfternoon')
                                                            :
                                                            t('common:mainScreen.goodEvening')
                                                    :
                                                    " "
                                            }</Text>

                                    </View>
                                    <View style={{
                                        flexDirection: 'column',
                                        height: 30,
                                        width: '50%',
                                        alignSelf: 'flex-end',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        borderBottomRightRadius: languageDrop ? 0 : 6,
                                        borderBottomLeftRadius: languageDrop ? 0 : 6,
                                        borderTopLeftRadius: 6,
                                        borderTopRightRadius: 6,
                                        borderBottomWidth: languageDrop ? 0.5 : 0,
                                        // borderRadius: languageDrop ? 0 : 6,
                                        backgroundColor: 'rgba(254,138,53,255)',
                                        marginRight: 20
                                    }}>
                                        <Pressable
                                            style={{ flexDirection: 'column', }}
                                            onPress={() => {
                                                setLanguageDrop(!languageDrop)
                                                console.log(languageDrop)
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{
                                                    color: '#fff',
                                                    fontFamily: 'Montserrat SemiBold',
                                                    fontSize: 12
                                                }}>
                                                    {t('common:mainScreen.languageSelector')}
                                                </Text>
                                                <Image source={require('../assets/expand-arrow.png')} style={{ height: 17, width: 17, marginLeft: 3, transform: [languageDrop ? { rotate: '180deg' } : { rotate: '0deg' }] }} />
                                            </View>
                                        </Pressable>
                                    </View>
                                    {
                                        languageDrop
                                            ?
                                            languages.map((item, i) => {
                                                console.log(i)
                                                return (
                                                    <Pressable
                                                        key={i}
                                                        style={{
                                                            height: 30,
                                                            width: '50%',
                                                            alignSelf: 'flex-end',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            position: 'relative',
                                                            borderBottomWidth: i ? 0 : 0.5,
                                                            borderBottomLeftRadius: i ? 6 : 0,
                                                            borderBottomRightRadius: i ? 6 : 0,
                                                            backgroundColor: 'rgba(254,138,53,255)',
                                                            marginRight: 20
                                                        }}
                                                        onPress={() => {
                                                            console.log(item.code)
                                                            setLanguage(item.code)
                                                            setLanguageDrop(!languageDrop)
                                                        }}>
                                                        <Text style={{ color: '#fff', fontFamily: 'Montserrat SemiBold', fontSize: 12 }}>
                                                            {item.label}
                                                        </Text>
                                                    </Pressable>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </View>
                            </View>
                            <View style={{ height: 20, backgroundColor: '#ffffff' }}>
                            </View>
                            {/* <View style={{ height: 40, backgroundColor: 'rgba(254,138,53,255)' }}>
                                <Text style={[styles.feed, { color: '#fff', fontFamily: 'Montserrat Bold' }]}>News Feed</Text>
                            </View> */}
                            {/* <View style={{ height: 400, borderColor: '#000', borderWidth: 0.2, width: width - 40, alignSelf: 'center', marginTop: 20, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat Bold', color: '#000', justifyContent: 'center' }}>
                                        Market Rates
                                    </Text>
                                </View> 
                            </View> */}
                            <View style={{ height: 280, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    graphData
                                        ?
                                        <Graph dataForGraph={dataForGraph} graphData={graphData} />
                                        :
                                        <Text>
                                            Loading !
                                        </Text>
                                }
                            </View>
                            <View style={{ height: 50, backgroundColor: '#ffffff' }}>
                            </View>
                            {/* <TouchableOpacity onPress={() => navigation.navigate('PriceScreen')}>
                    <Image style={[styles.avatar, { borderColor: "grey", height: 60, width: 60 }]} source={require('../assets/hamburger_menu_vector.png')} />
                </TouchableOpacity> */}
                            {/* <View style={{ height: 35, backgroundColor: 'rgba(254,138,53,255)' }}>
                                <Text style={[styles.feed, {
                                    color: '#fff', fontWeight: '500', textDecorationLine: 'underline',
                                    fontFamily: 'Montserrat Bold'
                                }]}>Market Rates</Text>
                            </View> */}
                            <View>
                                {
                                    daySell.length === 0
                                        ? <View style={{ height: 35 }}>
                                            <Text style={[{ color: '#000', alignSelf: 'center', fontFamily: 'Montserrat Bold', fontSize: 18 }]}>
                                                No Rates to Show
                                            </Text>
                                        </View>
                                        :
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: '15%', alignItems: 'center' }}>

                                                </View>
                                                <View style={{ width: '35%', alignItems: 'center' }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Montserrat Bold', fontSize: 16 }}>
                                                        {t('common:mainScreen.dailyPrice')}
                                                    </Text>
                                                </View>
                                                <View style={{ width: '50%', alignItems: 'center' }}>
                                                    <Text style={{ color: '#000', alignSelf: 'flex-end', marginRight: 20, fontFamily: 'Montserrat Bold', fontSize: 16 }}>
                                                        {t('common:mainScreen.priceChange')}
                                                    </Text>
                                                </View>
                                            </View>

                                            {
                                                daySell.map((item, i) => {
                                                    var currRate = 0
                                                    {/* console.log("currRate ----", (daySell[i].price)) */ }
                                                    daySell[i + 1] === undefined ? currRate = 4 : currRate = daySell[i].price - daySell[i + 1].price
                                                    return (
                                                        <View key={i} style={{ flexDirection: 'row' }}>
                                                            <View style={{ flexDirection: 'column', height: 55, width: '50%' }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    {
                                                                        currRate >= 0 ?
                                                                            <View style={[styles.feed, { height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                                                                <Image
                                                                                    source={require('../assets/up-arrow.png')}
                                                                                    style={{ height: "60%", width: "60%" }}
                                                                                />
                                                                            </View>
                                                                            :
                                                                            <View style={[styles.feed, { height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                                                                                <Image
                                                                                    source={require('../assets/down-arrow.png')}
                                                                                    style={{ height: "60%", width: "60%", }}
                                                                                />
                                                                            </View>
                                                                    }
                                                                    <View style={{ flexDirection: 'column' }}>
                                                                        <Text style={[{
                                                                            marginLeft: 20, fontSize: 16,
                                                                            color: '#000',
                                                                            fontFamily: 'Montserrat SemiBold'
                                                                        }]}>₹ {item.price}  {t('common:mainScreen.perLtr')}</Text>
                                                                        <Text style={[{
                                                                            marginLeft: 20,
                                                                            fontSize: 12,
                                                                            color: 'rgba(9,170,103,255)',
                                                                            fontFamily: 'Montserrat SemiBold'
                                                                        }]}>{item.date.split("-")[2]}-{item.date.split("-")[1]}-{item.date.split("-")[0]}</Text>
                                                                    </View>
                                                                    {/* <View style={{  marginLeft: 130,alignItems: 'center', justifyContent: 'center',borderColor:'#000',borderWidth:2,alignSelf:'center'}}>
                                                        <Text style={[{
                                                            color: '#fff',
                                                            fontSize: 23,
                                                            fontFamily: 'Montserrat Bold',
                                                            alignSelf: 'flex-end'
                                                        }]}>{
                                                                currRate >= 0 ? `+ ₹ ${currRate}` : `- ₹ ${-currRate}`
                                                            }</Text>
                                                    </View> */}
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', height: 55, width: '50%', justifyContent: 'center' }}>
                                                                <View style={{ marginRight: 30, alignItems: 'center', justifyContent: 'center', }}>
                                                                    {
                                                                        currRate >= 0
                                                                            ?
                                                                            <Text style={[{
                                                                                color: 'rgba(9,170,103,255)',
                                                                                fontSize: 18,
                                                                                fontFamily: 'Montserrat Bold',
                                                                                alignSelf: 'flex-end'
                                                                            }]}>
                                                                                + ₹{currRate}
                                                                            </Text>
                                                                            :
                                                                            <Text style={[{
                                                                                color: 'rgb(183,67,42)',
                                                                                fontSize: 18,
                                                                                fontFamily: 'Montserrat Bold',
                                                                                alignSelf: 'flex-end'
                                                                            }]}>
                                                                                - ₹{-currRate}
                                                                            </Text>
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                }
                            </View>
                            {/* <View style={{ flexDirection: 'column', height: 250, width: width - 40, borderRadius: 5, borderColor: '#000', padding: 20, alignSelf: 'center' }}>
                                <Text style={{ color: 'red' }}>
                                    {temp}
                                </Text>
                                <Text style={{ color: 'red' }}>
                                    {weather}
                                </Text>
                            </View> */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('PriceScreen')}
                            >
                                <Text style={{
                                    fontSize: 18, color: '#ffffff',
                                    fontFamily: 'Montserrat Bold'
                                }}>{t('common:mainScreen.placeOrder')}</Text>
                            </TouchableOpacity>
                            {/* <View style={{ marginTop: 30, alignItems: 'center', alignSelf: 'center', width: '90%', }}>
                                <Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>
                                    {t('common:mainScreen.menthaOilInfo')}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        toggleRead
                                            ?
                                            <View style={{ flexDirection: 'row', width: '100%', }}>
                                                <View style={{ width: '70%', }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Calibri Regular', paddingTop: 10 }}>
                                                        {t('common:mainScreen.infoSubstr')} ........
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={{ width: '30%', alignItems: 'center' }}
                                                    onPress={() => {
                                                        setToggleRead(!toggleRead)
                                                    }}>
                                                    <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                                        <Text style={{ color: 'rgba(254,138,53,255)', fontFamily: 'Montserrat SemiBold', }} >
                                                            {t('common:mainScreen.readLess')}
                                                        </Text>
                                                        <Image style={{ height: 15, width: 15, marginTop: 3, transform: [{ rotate: '180deg' }] }} source={require('../assets/arrow_orange.png')} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row', width: '100%', }}>
                                                <View style={{ width: '70%', }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Calibri Regular', paddingTop: 10 }}>
                                                        {t('common:mainScreen.infoSubstr')} ........
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={{ width: '30%', alignItems: 'center' }}
                                                    onPress={() => {
                                                        setToggleRead(!toggleRead)
                                                    }}>
                                                    <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                                        <Text style={{ color: 'rgba(254,138,53,255)', fontFamily: 'Montserrat SemiBold' }} >
                                                            {t('common:mainScreen.readMore')}
                                                        </Text>
                                                        <Image style={{ height: 15, width: 15, marginTop: 3 }} source={require('../assets/arrow_orange.png')} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                    }
                                </View>
                                {
                                    toggleRead
                                        ?
                                        <View style={{ width: width - 40 }}>
                                            <Text style={{ color: '#000', fontFamily: 'Calibri Regular', paddingTop: 10 }}>
                                                {t('common:mainScreen.infoFirstPara')}
                                            </Text>
                                            <View style={{ height: '5%' }}>

                                            </View>
                                            <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold' }}>
                                                {t('common:mainScreen.menthaOilComposition')}
                                            </Text>
                                            <Text style={{ color: '#000', fontFamily: 'Calibri Regular' }}>
                                                {t('common:mainScreen.infoSecondPara')}
                                            </Text>
                                            <View style={{ height: '5%' }}>

                                            </View>
                                            <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold' }}>
                                                {t('common:mainScreen.amazingHealthUses')}
                                            </Text>
                                            <Text style={{ color: '#000', fontFamily: 'Calibri Regular' }}>
                                                {"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>1.</Text>{' '}
                                                {t('common:mainScreen.1')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>2.</Text>{' '}
                                                {t('common:mainScreen.2')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>3.</Text>{' '}
                                                {t('common:mainScreen.3')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>4.</Text>{' '}
                                                {t('common:mainScreen.4')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>5.</Text>{' '}
                                                {t('common:mainScreen.5')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>6.</Text>{' '}
                                                {t('common:mainScreen.6')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>7.</Text>{' '}
                                                {t('common:mainScreen.7')}
                                                {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>8.</Text>{' '}
                                                {t('common:mainScreen.8')}
                                            </Text>

                                        </View>
                                        :
                                        null
                                }
                            </View> */}
                        </View>
                    </ScrollView>
            }
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 63,
        // marginBottom: 10,
        position: 'absolute',
        // marginTop: 70,
        // marginLeft: 10
    },
    profile: {
        marginLeft: 90,
    },
    feed: {
        marginLeft: 20,
        marginTop: 10,
    },
    button: {
        height: 45,
        width: width - 150,
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 10,
        backgroundColor: 'rgba(254,138,53,255)'
    }
})

export default MainScreen