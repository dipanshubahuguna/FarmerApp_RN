import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, RefreshControl, ImageBackground, Image, TouchableOpacity, Linking, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
// import VideoPlayer from 'react-native-video-player';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage'
import VideoPost from './VideoPost';

const { height, width } = Dimensions.get('window')

const Videos = () => {

    const [videos, setVideos] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(true)

    const fetchApi = async () => {
        const token = await AsyncStorage.getItem('token')
        console.log('token ---- ', token)
        console.log("entered video !!")
        try {
            const res = await client.get('/video', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data.data)
            if (res.data.message == 'success') {
                setVideos(res.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.log("blog error --- ", error)
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
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={{
                paddingHorizontal: 20,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 200
            }}>
                {
                    videos.map((item, i) => {
                        return (
                            <View key={i} style={{ paddingTop: 30 }}>
                                <VideoPost data = {item}/>
                            </View>
                        )
                    })
                }

            </View>
        </ScrollView>
    )
}

export default Videos