import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import LottieView from 'lottie-react-native';

const LottiePrice = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const animationRef = useRef()

    useEffect(() => {
        animationRef.current?.play();
    }, []);
    return (
        <View style={styles.centeredViewLottie}>
            <View style={styles.centeredViewLottie}>
                <View style={styles.modalViewLottie}>
                    <Text style={styles.modalTextLottie}>Order Placed Successfully</Text>
                    <View style={{ height: 150, width: 150, backgroundColor: '#fff' }}>
                        <LottieView
                            source={require('../../assets/done.json')}
                            ref={(animation) => {
                                animationRef.current = animation;
                            }}
                            autoPlay
                            loop
                        />
                    </View>
                    <Pressable
                        style={{
                            backgroundColor: 'rgba(250,156,46,255)', height: 25, width: 100, borderRadius: 60, alignSelf: 'center',
                        }}
                        onPress={() => {
                            setModalVisible(!modalVisible)
                            navigation.replace('MainScreen')
                        }}
                    >
                        <Text style={styles.textStyleLottie}>Continue</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredViewLottie: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'gray'
    },
    modalViewLottie: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyleLottie: {
        color: "white", 
        alignSelf: 'center',
    },
    modalTextLottie: {
        marginBottom: 15,
        textAlign: "center",
        color: '#000'
    }
});

export default LottiePrice