import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import client from '../api/client';
import { signOut } from '../api/user';
import CustomHeader from '../components/CustomHeader';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';



import LottieView from 'lottie-react-native';


const { height, width } = Dimensions.get('window')

const MainScreen = ({ navigation }) => {

    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);

    const { setIsLoggedIn, profile, userGlobal } = useLogin();
    const [daySell, setDaySell] = useState([])

    const [user, setUser] = useState()
    const [phone, setPhone] = useState()
    const [imageProfile, setImageProfile] = useState('')

    const fetchApi = async () => {
        const token = await AsyncStorage.getItem('token')
        try {
            console.log("reached /user")
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

            console.log("Market Rates ---- in mainScreen", res.data)
            console.log("User Detail ---- in mainScreen", user.data.name)
            console.log("User Detail ---- in mainScreen", user.data.phone)
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
        <ImageBackground source={require('../assets/Background.png')} resizeMode="cover" style={{ flex: 1 }}>
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
                    <ScrollView>
                        {/* <MyDrawer/> */}
                        <View>
                            <View style={{ height: 170, width: width, backgroundColor: "rgba(242,209,128,255)" }}>
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                                        <Image style={[{ marginLeft: 20, height: 20, width: 20 }]} source={require('../assets/hamburger_menu_vector.png')} />
                                    </TouchableOpacity>
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
                                        fontFamily: 'Calibri Regular'
                                    }}>Good Morning</Text>
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
                        <View style={{ height: 20, backgroundColor: '#ffffff' }}>
                        </View>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('PriceScreen')}>
                    <Image style={[styles.avatar, { borderColor: "grey", height: 60, width: 60 }]} source={require('../assets/hamburger_menu_vector.png')} />
                </TouchableOpacity> */}
                        <View style={{ height: 35, backgroundColor: 'rgba(254,138,53,255)' }}>
                            <Text style={[styles.feed, {
                                color: 'black', fontWeight: '500', textDecorationLine: 'underline',
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
                                    return (
                                        <View key={i} style={{ height: 35, backgroundColor: 'rgba(254,138,53,255)' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[styles.feed, {
                                                    color: '#fff',
                                                    fontFamily: 'Calibri Regular'
                                                }]}>{item.date}</Text>
                                                <Text style={[styles.feed, {
                                                    color: 'yellow', marginLeft: 40,
                                                    fontFamily: 'Calibri Regular'
                                                }]}>₹{item.price}</Text>
                                                <Text style={[styles.feed, {
                                                    color: 'yellow', marginLeft: 7,
                                                    fontFamily: 'Calibri Regular'
                                                }]}>Per ltr</Text>
                                            </View>
                                        </View>
                                    )
                                })
                        }
                        </>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('PriceScreen')}
                        >
                            <Text style={{
                                fontSize: 18, color: '#ffffff',
                                fontFamily: 'Montserrat Bold'
                            }}>Place Order</Text>
                        </TouchableOpacity>
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