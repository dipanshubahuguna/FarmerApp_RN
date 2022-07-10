import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import axios from 'axios'
import Wrapper from '../components/wrapper';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';


const InUpScreen = ({ navigation }) => {

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
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/logo_150x100.png')} />
                </View>
                <View style={{ flexDirection: 'row', padding: 20, marginBottom: 10 }}>
                    <Wrapper style={styles.borderLeft} title='Login' backgroundColor={loginColorInterpolate}
                        onPress={() => scrollView.current.scrollTo({ x: 0 })}
                    />
                    <Wrapper style={styles.borderRight} title='Register' backgroundColor={signupColorInterpolate}
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
        backgroundColor:'#fff'
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