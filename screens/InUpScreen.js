import React, { useEffect, useRef, useState } from 'react';
import {
    userRef,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    ImageBackground,
    Text,
    Button,
    useColorScheme,
    Dimensions,
    View,
    Animated,
    TextInput,
    useWindowDimensions,
    Pressable,
} from 'react-native';
import axios from 'axios'
import Wrapper from '../components/wrapper';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';


import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';


const InUpScreen = ({ navigation }) => {

    const { t, i18n } = useTranslation()

    const animation = useRef(new Animated.Value(0)).current

    const scrollView = useRef()

    const width = Dimensions.get('window').width

    const loginColorInterpolate = animation.interpolate({
        inputRange: [0, width],
        outputRange: ['rgba(254,138,53,1)', 'rgba(254,138,53,0.6)']
    })

    const signupColorInterpolate = animation.interpolate({
        inputRange: [0, width],
        outputRange: ['rgba(254,138,53,0.6)', 'rgba(254,138,53,255)']
    })


    const [languageDrop, setLanguageDrop] = useState(false)

    const languages = [
        { code: "en", label: 'english' },
        { code: "hin", label: 'हिन्दी' }
    ]


    const setLanguage = (code) => {
        console.log(code)
        return i18n.changeLanguage(code)
    }

    const fetchApi = async () => {
        try {
            const res = await axios.get('http://printrly.com/public/')
            // console.log(res.data)
        } catch (error) {
            // console.log("This is the new backed",error.message)
        }
    }

    useEffect(() => {
        fetchApi()
    }, [])

    return (
        <View style={styles.root}>
            <ImageBackground style={styles.image}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: languageDrop ? 180 : 120,}}>
                    <View style={{
                        // borderWidth: 3,
                        // borderColor: '#000',
                        height:'100%',
                        width:'40%'
                    }}>
                        <Image source={require('../assets/logo_150x100.png')} />
                    </View>
                    <View style={{ flexDirection: 'column',width:'40%' }}>

                        <View style={{
                            flexDirection: 'column',
                            height: 30,
                            width: '100%',
                            alignSelf: 'center',
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
                            // borderWidth: 3,
                            // borderColor: '#000'
                            // marginRight: 20
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
                                                height: 25,
                                                width: '100%',
                                                alignSelf: 'flex-end',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                borderBottomWidth: i ? 0 : 0.5,
                                                borderBottomLeftRadius: i ? 6 : 0,
                                                borderBottomRightRadius: i ? 6 : 0,
                                                backgroundColor: 'rgba(254,138,53,255)',
                                                // marginRight: 20
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
                <View style={{ flexDirection: 'row', padding: 20, marginBottom: 10 }}>
                    <Wrapper style={styles.borderLeft} title={t('common:loginForm.login')} backgroundColor={loginColorInterpolate}
                        onPress={() => scrollView.current.scrollTo({ x: 0 })}
                    />
                    <Wrapper style={styles.borderRight} title={t('common:loginForm.register')} backgroundColor={signupColorInterpolate}
                        onPress={() => scrollView.current.scrollTo({ x: width })}
                    />
                </View>
                <ScrollView
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: animation } } }], { useNativeDriver: false })}
                    ref={scrollView}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="always" nestedScrollEnabled={true}
                >
                    <LoginForm navigation={navigation} />
                    <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled={true}>
                        <SignUpForm navigation={navigation} />
                    </ScrollView>
                </ScrollView>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    image: {
        flex: 1,
        backgroundColor: '#fff'
        // justifyContent: "center",
    },
    borderLeft: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
    borderRight: {
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
})

export default InUpScreen