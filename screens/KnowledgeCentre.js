import React, { useState, useRef } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, Animated, ScrollView, TouchableOpacity } from 'react-native';
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';
import Wrapper from '../components/wrapper';
import Blogs from './Blogs';
import LottieGK from './Lottie/LottieGK';
import Videos from './Videos';


const KnowledgeCentre = ({navigation}) => {


    const width = Dimensions.get('window').width

    const animation = useRef(new Animated.Value(0)).current

    const scrollView = useRef()

    const blogColorInterpolate = animation.interpolate({
        inputRange: [0, width],
        outputRange: ['rgba(254,138,53,255)', 'rgba(254,138,53,0.3)']
    })

    const videosColorInterpolate = animation.interpolate({
        inputRange: [0, width],
        outputRange: ['rgba(254,138,53,0.3)', 'rgba(254,138,53,255)']
    })



    return (
        <ImageBackground style={styles.image}>
            {/* <LottieGK/> */}
            <View style={{ flexDirection: 'row', marginTop: 20,width:width-32,alignSelf:'center'}}>
                <Wrapper style={styles.borderLeft} title='Blogs' backgroundColor={blogColorInterpolate}
                    onPress={() => scrollView.current.scrollTo({ x: 0 })} />
                <Wrapper style={styles.borderRight} title='Videos' backgroundColor={videosColorInterpolate}
                    onPress={() => scrollView.current.scrollTo({ x: width })} />
            </View>
            <ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: animation } } }], { useNativeDriver: false })}
                ref={scrollView}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                <Blogs navigation={navigation}/>
                {/* <ScrollView> */}
                <Videos />
                {/* </ScrollView> */}
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        backgroundColor:'#fff'
    },
    borderLeft: {
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    borderRight: {
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
})

export default KnowledgeCentre