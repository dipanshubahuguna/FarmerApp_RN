import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import client from '../api/client';
import { signOut } from '../api/user';
import CustomHeader from '../components/CustomHeader';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';
import Geolocation from '@react-native-community/geolocation';



import LottieView from 'lottie-react-native';
import Graph from './graph';


const { height, width } = Dimensions.get('window')

const DATA = [
    { x: new Date(2022, 5, 16), y: 2600 },
    { x: new Date(2022, 5, 15), y: 900 },
    { x: new Date(2022, 5, 14), y: 1501 },
    { x: new Date(2022, 5, 13), y: 950 },
    { x: new Date(2022, 5, 12), y: 1201 },
    { x: new Date(2022, 5, 11), y: 1000 },
];

const dataToSend = [...DATA].reverse()
// console.log("dataToSend---------", dataToSend)



const MainScreen = ({ navigation }) => {

    let [graphData, setGraphData] = useState([])
    let hourNow = new Date().getHours()

    let dateNow = new Date().getDate()
    let monthNow = new Date().getMonth() + 1
    let yearNow = new Date().getFullYear()

    const validDateArray = []

    for (let i = 0; i < 6; ++i) {
        const currDate = dateNow
        const currMonth = monthNow
        const currYear = yearNow
        if (dateNow - i > 0) currDate = dateNow - i;
        else if (dateNow - i <= 0) {
            currDate = 31;
            if (monthNow - i > 0) currMonth = monthNow - i;
            else if (monthNow - i <= 0) {
                currMonth = monthNow - i;
                currYear = yearNow - i;
            }
        }
        validDateArray.push(
            new Date(currYear, currMonth, currDate)
        )
    }

    // console.log("validDateArray ---------",validDateArray)

    // console.log(" Date Now ----", dateNow)
    // console.log(" Month Now ----", monthNow)
    // console.log(" Year Now ----", yearNow)

    const dateData = [
        { x: validDateArray[0], y: 2600 },
        { x: validDateArray[1], y: 900 },
        { x: validDateArray[2], y: 1501 },
        { x: validDateArray[3], y: 950 },
        { x: validDateArray[4], y: 1201 },
        { x: validDateArray[5], y: 1000 },
    ]

    // console.log("dateData ---------",dateData)

    const newDataToSend = [...dateData].reverse()

    // console.log("hourNow    ----------------------------      ", hourNow)

    const [temp, setTemp] = useState('loading...')
    const [weather, setWeather] = useState('loading...')

    Geolocation.getCurrentPosition((info) => {
        // console.log("latitude", info.coords.latitude)
        // console.log("longitude", info.coords.longitude)
    });

    const animationRef = useRef()

    // const getWeather = async () => {
    //     try {
    //         const res = await fetch("http://dataservice.accuweather.com/currentconditions/v1/202446?apikey=gvEydLaYa3wqo6rCLzpuekTZhEGhWdGr")
    //         const resp = await res.json()
    //         console.log("weather fetched -----", resp[0])
    //         setTemp(resp[0].Temperature.Metric.Value)
    //         setWeather(resp[0].WeatherText)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        animationRef.current?.play();
        // getWeather()
    }, []);

    const { setIsLoggedIn, profile, userGlobal } = useLogin();
    const [daySell, setDaySell] = useState([])

    const [user, setUser] = useState()
    const [phone, setPhone] = useState()
    const [imageProfile, setImageProfile] = useState('')
    const [toggleRead, setToggleRead] = useState(false)

    const fetchApi = async () => {
        const token = await AsyncStorage.getItem('token')
        try {
            // console.log("reached /user")
            const res = await client.get('/day-selling', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const user = await client.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // console.log("Market Rates ---- in mainScreen", res.data.data)
            console.log("User Profile ---- in mainScreen", user.data)
            await res.data.data.map((item, i) => {
                const d = String(item.date).split("-")
                // console.log(d)
                let date = d[2]
                let month = d[1]
                let year = d[0]
                // DATA.push({x:new Date(year,month,date),y:item.price})
                let newData = { x: new Date(year, month, date), y: item.price }
                setGraphData((prevState) => { return [...prevState, newData] })

                // console.log(new Date(year,month,date))

                // console.log(item.date, item.price, i)
            })
            // console.log("graphData in mainScreen.js---------", graphData.reverse())
            // console.log("User Detail ---- in mainScreen", user.data.name)
            // console.log("User Detail ---- in mainScreen", user.data.phone)
            // console.log("User Detail ---- in mainScreen", user.data.kyc.photo)
            setDaySell(res.data.data)
            setUser(user.data.name)
            setPhone(user.data.phone)
            if (user.data.kyc != null) {
                setImageProfile(user.data.kyc.photo)
            }
        } catch (error) {
            console.log(error)
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
        fetchApi()
    }, [])

    return (
        <ImageBackground style={{ flex: 1, backgroundColor: '#fff' }}>
            {
                !(user && phone)
                    ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                                <Image style={[{ marginLeft: 20, height: 20, width: 20 }]} source={require('../assets/hamburger_menu_vector.png')} />
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
                                <View style={{ height: 170, width: width, backgroundColor: "rgba(242,209,128,255)" }}>
                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                                            <Image style={[{ marginLeft: 20, height: 20, width: 20 }]} source={require('../assets/hamburger_menu_vector.png')} />
                                        </TouchableOpacity>
                                        {/* <View style={{height: 40, width: 60, marginLeft:width - 100}}>
                                            <Text style={{fontSize:23,color: '#fff' }}>
                                                {temp}
                                            </Text>
                                        </View> */}
                                        <LottieView
                                            style={{ height: 40, width: 60, marginLeft: width - 260 }}
                                            source={require('../assets/lf30_editor_6jvza7e2.json')}
                                            ref={(animation) => {
                                                animationRef.current = animation;
                                            }}
                                            autoPlay
                                            loop
                                        />
                                    </View>
                                    {/* <CustomHeader navigation={navigation}/> */}
                                    <View style={styles.profile}>
                                        <Text style={{
                                            fontWeight: '600',
                                            color: '#000000',
                                            fontFamily: 'Calibri Bold'
                                        }}>{
                                                hourNow >= 0
                                                    ?
                                                    hourNow <= 11
                                                        ?
                                                        "Good Morning"
                                                        :
                                                        hourNow <= 17
                                                            ?
                                                            "Good Afternoon"
                                                            :
                                                            "Good Evening"
                                                    :
                                                    " "
                                            }</Text>
                                        <Text style={{
                                            marginTop: 5,
                                            color: '#000000',
                                            fontSize: 20,
                                            fontFamily: 'Montserrat Bold'
                                        }}>{user}</Text>
                                        {/* <Text style={{
                                        fontWeight: '600',
                                        color: '#000000',
                                        fontFamily: 'Calibri Regular'
                                    }}>{phone}</Text> */}
                                    </View>
                                    {
                                        imageProfile
                                            ?
                                            <Image style={[styles.avatar, { marginLeft: 20, height: 60, width: 60 }]} source={{ uri: imageProfile }} />
                                            :
                                            <Image style={[styles.avatar, { marginLeft: 10 }]} source={require('../assets/Dp.png')} />
                                    }
                                </View>
                            </View>
                            <View style={{ height: 20, backgroundColor: '#ffffff' }}>
                            </View>
                            <View style={{ height: 40, backgroundColor: 'rgba(254,138,53,255)' }}>
                                <Text style={[styles.feed, { color: '#fff', fontFamily: 'Montserrat Bold' }]}>News Feed</Text>
                            </View>
                            {/* <View style={{ height: 400, borderColor: '#000', borderWidth: 0.2, width: width - 40, alignSelf: 'center', marginTop: 20, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat Bold', color: '#000', justifyContent: 'center' }}>
                                        Market Rates
                                    </Text>
                                </View> 
                            </View> */}
                            <Graph data={newDataToSend} graphData={graphData} />
                            <View style={{ height: 20, backgroundColor: '#ffffff' }}>
                            </View>
                            {/* <TouchableOpacity onPress={() => navigation.navigate('PriceScreen')}>
                    <Image style={[styles.avatar, { borderColor: "grey", height: 60, width: 60 }]} source={require('../assets/hamburger_menu_vector.png')} />
                </TouchableOpacity> */}
                            <View style={{ height: 35, backgroundColor: 'rgba(254,138,53,255)' }}>
                                <Text style={[styles.feed, {
                                    color: '#fff', fontWeight: '500', textDecorationLine: 'underline',
                                    fontFamily: 'Montserrat Bold'
                                }]}>Market Rates</Text>
                            </View>
                            <>{
                                daySell.length === 0
                                    ? <View style={{ height: 35, backgroundColor: 'rgba(254,138,53,255)' }}>
                                        <Text style={[{ fontWeight: '800', color: '#fff', alignSelf: 'center' }]}>
                                            No Rates to show
                                        </Text>
                                    </View>
                                    :
                                    daySell.map((item, i) => {
                                        var currRate = 0
                                        {/* console.log("currRate ----", (daySell[i].price)) */ }
                                        daySell[i + 1] === undefined ? currRate = 500 : currRate = daySell[i].price - daySell[i + 1].price
                                        return (
                                            <View key={i} style={{ flexDirection: 'row' }}>
                                                <View style={{ flexDirection: 'column', height: 55, backgroundColor: 'rgba(254,138,53,255)', width: '50%' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        {
                                                            currRate >= 0 ?
                                                                <View style={[styles.feed, { height: 40, width: 40, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }]}>
                                                                    <Image
                                                                        source={require('../assets/up-arrow.png')}
                                                                        style={{ height: "60%", width: "60%" }}
                                                                    />
                                                                </View>
                                                                :
                                                                <View style={[styles.feed, { height: 40, width: 40, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                                                                    <Image
                                                                        source={require('../assets/up-arrow.png')}
                                                                        style={{ height: "60%", width: "60%", transform: [{ rotate: '180 deg' }] }}
                                                                    />
                                                                </View>
                                                        }
                                                        <View style={{ flexDirection: 'column' }}>
                                                            <Text style={[{
                                                                marginLeft: 20, fontSize: 15,
                                                                color: 'yellow',
                                                                fontFamily: 'Montserrat SemiBold'
                                                            }]}>₹{item.price}  Per ltr</Text>
                                                            <Text style={[{
                                                                marginLeft: 20,
                                                                fontSize: 12,
                                                                color: '#fff',
                                                                fontFamily: 'Montserrat SemiBold'
                                                            }]}>{item.date}</Text>
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
                                                <View style={{ flexDirection: 'column', height: 55, backgroundColor: 'rgba(254,138,53,255)', width: '50%' }}>
                                                    <View style={{ marginRight: 30, alignItems: 'center', justifyContent: 'center', }}>
                                                        <Text style={[{
                                                            color: '#fff',
                                                            fontSize: 23,
                                                            fontFamily: 'Montserrat Bold',
                                                            alignSelf: 'flex-end'
                                                        }]}>{
                                                                currRate >= 0 ? `+ ₹ ${currRate}` : `- ₹ ${-currRate}`
                                                            }</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                            }
                            </>
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
                                }}>Place Order</Text>
                            </TouchableOpacity>
                            <View style={{ marginLeft: 20, marginTop: 30 }}>
                                <Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>
                                    MENTHA OIL INFORMATION
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        toggleRead
                                            ?
                                            <TouchableOpacity onPress={() => {
                                                setToggleRead(!toggleRead)
                                            }}>
                                                <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                                    <Text style={{ color: 'rgba(254,138,53,255)', fontFamily: 'Montserrat SemiBold', marginLeft: width - 120 }} >
                                                        Read Less
                                                    </Text>
                                                    <Image style={{ height: 15, width: 15, marginTop: 3, transform: [{ rotate: '180deg' }] }} source={require('../assets/arrow_orange.png')} />
                                                </View>
                                            </TouchableOpacity>
                                            :
                                            <>
                                                <Text style={{ color: '#000', fontFamily: 'Calibri Regular', paddingTop: 10 }}>
                                                    The plant of Mentha Arvensis species attributes its ........
                                                </Text>
                                                <TouchableOpacity onPress={() => {
                                                    setToggleRead(!toggleRead)
                                                }}>
                                                    <View style={{ flexDirection: 'row', paddingTop: 10, }}>
                                                        <Text style={{ color: 'rgba(254,138,53,255)', fontFamily: 'Montserrat SemiBold', marginLeft: 10 }} >
                                                            Read More
                                                        </Text>
                                                        <Image style={{ height: 15, width: 15, marginTop: 3 }} source={require('../assets/arrow_orange.png')} />
                                                    </View>
                                                </TouchableOpacity>
                                            </>
                                    }
                                </View>
                                {
                                    toggleRead
                                        ?
                                        <View style={{ width: width - 40 }}>
                                            <Text style={{ color: '#000', fontFamily: 'Calibri Regular', paddingTop: 10 }}>
                                                The plant of Mentha Arvensis
                                                species attributes its aromatic properties to the presence of essential oil
                                                rich in sesquiterpenes, monoterpenes and volatile constituents such as menthol,
                                                pulgone, isomenthone, menthone, carvacol, imparting characteristic mint flavor.
                                                It is currently used in many countries for various ailments. Basically small quantity of Mentha
                                                extracts in the form of oil can help to creams, Balm, cough medicines, cigarettes, food, and many soft drinks.
                                            </Text>
                                            <View style={{ height: '5%' }}>

                                            </View>
                                            <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold' }}>
                                                Mentha Oil Chemical Composition
                                            </Text>
                                            <Text style={{ color: '#000', fontFamily: 'Calibri Regular' }}>
                                                Chemical observation basically indicates the properties of Mentha
                                                arvensis oil behalf of the GC and MS reports, during extraction process Mentha oil.
                                                It consists of the properties of beta-caryophyllene, alpha-pinene, piperine, beta-pinene,
                                                tannins and flavonoids, menthol, menthone, iso menthone, neomenthol,
                                                limonene, methyl acetate and more.
                                            </Text>
                                            <View style={{ height: '5%' }}>

                                            </View>
                                            <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold' }}>
                                                Amazing Health Uses And Benefits of Mentha Oil
                                            </Text>
                                            <Text style={{ color: '#000', fontFamily: 'Calibri Regular' }}>
                                             {"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>1.</Text>{' '}
                                                This healthy oil is useful for many skin’s related problems e.g. acne. It acts as a natural cleanser and gently cleanses the skin.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>2.</Text>{' '}
                                                 Another way of using peppermint oil to treat acne is to mix few drops of peppermint oil with grapeseed or jojoba oil and then massage it on the affected areas.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>3.</Text>{' '}
                                                 To treat acne, apply a few drops of the pure essential oil on the acne-affected areas directly. Do this 2-4 times per day. However, due to skin sensitivity, it is advised to use the oil in diluted form.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>4.</Text>{' '}
                                                 Dip cotton swab in AOS Mentha Oil or get a drop on your fingertip and apply it onto the affected area. This oil works beautifully as it soothes and numbs the tooth area in a few minutes.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>5.</Text>{' '}
                                                 In Ayurveda, Mentha oil referred as trustable oil for health as hormone and purity.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>6.</Text>{' '}
                                                 Mentha oil useful for improving nervous system.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>7.</Text>{' '}
                                                 Apply it when you are suffering from depression.
                                             {"\n"}{"\n"}<Text style={{ color: '#000', fontFamily: 'Montserrat Bold' }}>8.</Text>{' '}
                                                 Mentha oil uses in many cosmetic and Pharma products that helpful to reduce Acne, Fever and Dandruff etc.

                                            </Text>

                                        </View>
                                        :
                                        null
                                }
                            </View>
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
        marginBottom: 10,
        position: 'absolute',
        marginTop: 70,
        marginLeft: 10
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
        width: width - 50,
        marginTop: 30,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 20,
        backgroundColor: 'rgba(254,138,53,255)'
    }
})

export default MainScreen