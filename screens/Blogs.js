import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button,RefreshControl, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage'
import CUstomAnimatedLoader from '../components/CustomAnimatedLoader';

const { height, width } = Dimensions.get('window')

const Blogs = ({ navigation }) => {
    const [blogs, setBlogs] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [toggle, setToggle] = useState(null)

    const [refreshing, setRefreshing] = useState(false);

    const fetchApi = async () => {
        const token = await AsyncStorage.getItem('token')
        console.log('token ---- ', token)
        console.log("entered blog !!")
        try {
            const res = await client.get('/blog', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data.data)
            if (res.data.message == 'success') {
                setBlogs(res.data.data)
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
            }>
            <View style={{
                paddingHorizontal: 20,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 200
            }}>
                {
                    isLoading
                        ?
                        <CUstomAnimatedLoader />
                        :
                        blogs
                            ?
                            blogs.map((item, i) => {
                                return (
                                    <View key={i} style={{ height: 300, width: width - 60, padding: 20, paddingLeft: 0, }}>
                                        <Image source={{ uri: item.logo }} style={{ height: 180, width: width - 60 }} />
                                        <View style={{ backgroundColor: '#fff', borderWidth: 0, borderColor: '#000' }} >
                                            <Text style={{ color: 'rgba(254,138,53,255)', fontWeight: '600', fontSize: 16, padding: 10, paddingLeft: 0 }}>{item.name}</Text>
                                            <Text style={{ color: '#000', fontWeight: '400', fontSize: 13, paddingBottom: 10 }}>{item.content.substring(0, 100)}............</Text>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('Post', { data: item })}
                                                style={{ marginLeft: width / 1.6 }}
                                            >
                                                <Text style={{color:'rgba(254,138,53,255)'}} >
                                                    Read More
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ height: 1, backgroundColor: '#000' }}></View>
                                    </View>
                                )
                            })
                            :
                            <Text>No Blogs</Text>
                }
            </View>
        </ScrollView>
    )
}

export default Blogs