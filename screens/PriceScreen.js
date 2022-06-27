import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, TextInput, ImageBackground, Image, Button, ScrollView, Alert } from 'react-native'
import { useLogin } from '../context/LoginProvider'
import client from '../api/client'
import AsyncStorage from "@react-native-async-storage/async-storage"
import CustomModalInput from '../components/CustomModalIput'
import { RadioButton } from 'react-native-paper';
import axios from 'axios'
import { setHours } from 'date-fns'



const { height, width } = Dimensions.get('window')

const PriceScreen = ({ navigation, props }) => {




  const phone = ""

  const [rs, setRs] = useState('0')
  const [qty, setQty] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState()
  const [fetchedPin, setFetchedPin] = useState([])
  const [inputPin, setInputPin] = useState('')
  const [fetchedPreviously, setFetchedPreviously] = useState(false)
  const [error, setError] = useState('')
  const [popUp,setPopUp] = useState(false)

  const updateError = (error, stateUpdater) => {
    stateUpdater(error)
    setTimeout(() => {
      stateUpdater('')
    }, 2500)
  }

  const fetchApi = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await axios.get('http://printrly.com/public/api/price/1', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data)
      if (res.data.message === 'success') {
        setRs(res.data.data)
        console.log(res.data.data)
        console.log("rs --", rs)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchApi()
  }, [])


  const fetchPin = async (searchPIN) => {
    try {
      const token = await AsyncStorage.getItem('token')
      console.log("searchPIN ---- ", searchPIN)
      const res = await axios.get(`http://printrly.com/public/api/fc/${searchPIN}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("res ---- ", res.data.data)
      if (res.data.message === 'success') {
        setFetchedPin(res.data.data)
        setFetchedPreviously(true)
      }
      console.log(fetchedPin.length)
    } catch (error) {
      console.log("error --- ", error)
    }
  }

  const sendQty = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const farmer_id = await AsyncStorage.getItem('userId')
      console.log("farmer_id --- ", farmer_id)
      console.log("token --- ", token)
      // console.log("fc_id---",pin)
      // console.log('qty------',qty)
      // console.log('mode-------',cash)
      // console.log('phone-------',phone)


      const fc_id = pin
      const mode = "cash"
      // const sendData = {
      //   farmer_id,
      //   fc_id:pin,
      //   qty,
      //   mode:cash
      // }


      // console.log(sendData)

      const res = await axios.post('http://printrly.com/public/api/order', { farmer_id, fc_id, qty, mode }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("res---")
      console.log(res.data.message.split(' ')[0])
      if(res.data.message.split(' ')[0] === "success"){
        setPopUp(true)
      }
      // console.log(res)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/Background.png')}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          >
            <View>
              <View style={styles.header}>
                <TouchableOpacity onPressIn={() => navigation.navigate('MainScreen')}>
                  <Image style={[{ borderColor: "grey", marginTop: 10, height: 30, width: 30 }]} source={require('../assets/Back.png')} />
                </TouchableOpacity>
              </View>
              <Image style={styles.avatar} source={require('../assets/Untitled-1-removebg-preview-removebg-preview.jpg')} />
            </View>
            <View style={styles.gap}>
              <Text style={{ fontWeight: '600', fontSize: 20, color: 'green', }}>Mentha Oil</Text>
              <Text style={{ marginTop: 10, fontWeight: '600', fontSize: 15, color: '#000', }}>Submit Your Details</Text>
            </View>
            {
              error
                ?
                <View style={{ alignSelf: 'center', marginTop: 50 }}>
                  <Text style={{ color: 'red' }}> {error} </Text>
                </View>
                :
                null
            }
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput placeholder='Enter Quantity'
                placeholderTextColor='rgba(37, 124, 122, 1)'
                textAlign='center'
                value={qty}
                onChangeText={(value) => {
                  setQty(value)
                  console.log(qty)
                }}
                style={{
                  marginLeft: 30, marginTop: 70, borderWidth: 0.5, height: 40, width: 150, color: '#000000', borderRadius: 10
                }} />
              <Text style={{ marginLeft: 10, marginTop: 70, fontWeight: '600', fontSize: 15, color: '#000000' }}>Ltr</Text>
              <View style={{
                marginLeft: 30, marginTop: 70, paddingLeft: 20, height: 40, width: 110, color: '#000000'
              }}>
                <Text style={{ color: 'rgba(37, 124, 122, 1)', marginTop: 12 }}>
                  {rs}
                </Text>
              </View>
              <Text style={{ marginLeft: 10, marginTop: 70, fontWeight: '600', fontSize: 15, color: '#000000' }}>₹</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                qty
                  ?
                  setModalVisible(true)
                  // console.log("qty --- ", qty)
                  :
                  updateError("Please enter Quantity", setError)
              }
              }
            >
              <Text style={{ fontSize: 18, color: '#ffffff' }}>Locate center</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setPin()
            setInputPin()
            setFetchedPreviously(false)
            setModalVisible(!modalVisible)
          }}
        >
          <ImageBackground
            source={require('../assets/price_blur.png')}
            resizeMode="cover"
            style={{ flex: 1 }}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled={true}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100, marginBottom: 50 }}>
                <View style={[styles.centeredView]}>
                  <Text style={[{ color: '#000', alignSelf: 'center', paddingTop: 30, fontSize: 16 }]}>Select Pincode</Text>
                  <Text style={[{ color: '#000', alignSelf: 'center', paddingTop: 10, fontSize: 12 }]}>Click on search icon</Text>
                  <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 15, padding: 30 }}>
                    <TextInput
                      placeholderTextColor="#000"
                      style={[styles.input, { width: width / 2 }]}
                      textAlign='center'
                      value={inputPin}
                      onChangeText={(value) => {
                        setInputPin(value)
                        console.log(inputPin)
                      }}
                    />
                    <TouchableOpacity
                      style={{ marginLeft: 5, marginTop: 12, height: 20, width: 20, }}
                      onPress={() => {
                        console.log("inputPin----- ", inputPin)
                        console.log("fetchedPin---------------", fetchedPin.length)
                        fetchPin(inputPin)
                      }}
                    >
                      <Image style={{ height: 20, width: 20, alignSelf: 'center', }} source={require('../assets/search.png')} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                    {
                      fetchedPreviously === false
                        ?
                        null
                        :
                        fetchedPreviously === true && fetchedPin.length == 0
                          ?
                          <Text style={{ padding: 20, color: 'red' }}>
                            No center located
                          </Text>
                          :
                          fetchedPin.map((item, i) => {
                            const id = item.id
                            {/* console.log(id) */ }
                            return (
                              <View key={i} style={{ flexDirection: 'row', padding: 10 }}>
                                <RadioButton
                                  value={id}
                                  status={pin == id ? 'checked' : 'unchecked'}
                                  onPress={() => {
                                    setPin(id)
                                    console.log(id)
                                    console.log(qty)
                                  }}
                                  color='red'
                                  uncheckedColor='#fff'
                                />
                                <Text style={{ marginTop: 7, color: '#000', paddingRight: 20 }}>
                                  {item.address}
                                </Text>
                              </View>
                            )
                          })
                    }
                  </View>
                  {
                    fetchedPin.length != 0 && pin ?
                      <TouchableOpacity
                        style={[styles.buttonModal]}
                        onPress={() => {
                          // setFetchedPin([])
                          setQty()
                          setPin()
                          setInputPin()
                          setFetchedPreviously(false)
                          sendQty()
                          setModalVisible(!modalVisible)
                          fetchedPin ? navigation.replace('LottiePrice') : Alert.alert('Pin and select center')
                        }}
                      >
                        <Text style={{ color: '#fff' }}>Continue</Text>
                      </TouchableOpacity>
                      :
                      null
                  }
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </Modal>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
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
  },
  header: {
    backgroundColor: "rgba(242,210,125,255)",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "rgba(37, 124, 122, 0.7)",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  gap: {
    marginTop: 70,
    alignItems: 'center'
  },
  buttonModal: {
    height: 35,
    width: '60%',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 40,
    backgroundColor: 'rgba(254,138,53,255)'
  },
  submit: {
    height: 45,
    width: width - 50,
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 15,
    backgroundColor: '#FF4500'
  },
  centeredView: {
    // height: '100%',
    width: '80%',
    alignSelf: 'center',
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'rgba(242,210,125,255)',
    borderRadius: 25
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000'
  }
})


export default PriceScreen