import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, TextInput, ImageBackground, Image, Button, ScrollView, Alert } from 'react-native'
import { useLogin } from '../context/LoginProvider'
import client from '../api/client'
import AsyncStorage from "@react-native-async-storage/async-storage"
import CustomModalInput from '../components/CustomModalIput'
import { RadioButton } from 'react-native-paper';
import axios from 'axios'
import { setHours } from 'date-fns'



import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';




const { height, width } = Dimensions.get('window')

const PriceScreen = ({ navigation, props }) => {
  
  
  
  const { t, i18n } = useTranslation()
  
  const phone = ""
  
  const [rs, setRs] = useState('0')
  const [qty, setQty] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState()
  const [fetchedPin, setFetchedPin] = useState([])
  const [inputPin, setInputPin] = useState('')
  const [fetchedPreviously, setFetchedPreviously] = useState(false)
  const [error, setError] = useState('')
  const [popUp, setPopUp] = useState(false)
  const [id, setId] = useState('')
  const [imageProfile, setImageProfile] = useState()
  
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

      console.log("response -------- ",res.data)

      const user = await axios.get('http://printrly.com/public/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // console.log("user.data",user.data)
      // console.log("User data", user.data.kyc.photo)
      // setImageProfile(user.data.kyc.photo)
      console.log(user.data.id)

      setId(user.data.id)

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
  }, [qty])


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
      // const farmer_id = await AsyncStorage.getItem('userId')
      // console.log("farmer_id --- ", farmer_id)
      console.log("token --- ", token)
      // console.log("fc_id---",pin)
      // console.log('qty------',qty)
      // console.log('mode-------',cash)
      // console.log('phone-------',phone)
      console.log("id in sendQTY", id)


      const farmer_id = id
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
      console.log(res.data)

      console.log(res.data.message.split(' ')[0])
      if (res.data.message.split(' ')[0] === "success") {
        setPopUp(true)
      }
      // console.log(res)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={{ flex: 1}}>
      <View style={{ flex: 1, backgroundColor: '#fff'}}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
        >
        <View style={{marginBottom:100}} >
          <View style={{}}>
            <View style={{ flexDirection: 'row', marginTop: 20,width:'100%', }}>
              <TouchableOpacity onPress={() => { navigation.navigate('MainScreen') }} style={{width:'25%',}}>
                <Image style={[{ marginLeft: 20, height: 40, width: 40 }]} source={require('../assets/Back.png')} />
              </TouchableOpacity>
              {/* <View style={{ width: width / 4 }}>
              </View> */}
              <View style={{ alignItems: 'flex-end',width:'35%',}}>
                <Image style={{ height: 50, width: 100, alignSelf: 'center' }} source={require('../assets/logo_150x100-removebg-preview.png')} />
              </View>
              {/* <View style={{ width: width / 8 }}>
              </View> */}
              <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row',width:'40%', }}>
                <Image style={[{ height: 30, width: 30 }]} source={require('../assets/Notification.png')} />
                <View style={{ height: 50, width: 50, marginLeft: 10 }}>
                  {
                    imageProfile
                      ?
                      <Image style={[styles.avatar]} source={{ uri: imageProfile }} />
                      :
                      <Image style={[styles.avatar]} source={require('../assets/Dp.png')} />
                  }
                </View>
              </View>
            </View>
            <View style={{
              backgroundColor: 'rgb(255,122,47)', height: height / 1.8, width: width - 60, alignSelf: 'center', justifyContent: 'center', borderRadius: 30, marginTop: 130,
            }}>
              <Text style={{ fontWeight: '600', fontSize: 20, color: '#fff', alignSelf: 'center', marginTop: 80, fontFamily: 'Montserrat Bold' }}>{t('common:priceScreen.menthaOil')}</Text>
              <View style={{ backgroundColor: '#fff', height: '60%', width: '85%', alignSelf: 'center', marginTop: 20, borderRadius: 30 }}>
                {
                  error
                    ?
                    <View style={{ alignSelf: 'center', marginTop: 10 }}>
                      <Text style={{ color: 'red', fontFamily: 'Montserrat SemiBold' }}> {error} </Text>
                    </View>
                    :
                    null
                }
                <Text style={{ marginTop: 10, fontWeight: '600', fontSize: 15, color: '#000', alignSelf: 'center', fontFamily: 'Montserrat SemiBold' }}>{t('common:priceScreen.submitDetails')}</Text>
                <Text style={{ marginTop: 10, fontWeight: '600', fontSize: 13, color: '#000', alignSelf: 'center', fontFamily: 'Montserrat SemiBold' }}>{t('common:priceScreen.quantity')}</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width - 80, marginTop: 20, alignSelf: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput
                      placeholderTextColor='rgba(37, 124, 122, 1)'
                      textAlign='center'
                      value={qty}
                      onChangeText={(value) => {
                        setQty(value)
                        console.log(qty)
                      }}
                      keyboardType="numeric"
                      style={{ height: 40, width: 150, color: '#000000', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: 'rgb(246,244,245)' }} />
                    <View style={{ height: 40, width:40,borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: 'rgb(246,244,245)',alignSelf: 'center',justifyContent:'center',alignItems:'center',marginLeft:-1}}>
                      <Text style={{ fontWeight: '600', fontSize: 13, color: '#000000', fontFamily: 'Montserrat SemiBold'}}>{t('common:priceScreen.ltr')}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(6,171,104)', borderRadius: 8, height: 30, width: '50%', marginTop: 10 }}>
                    <Text style={{ color: '#fff', fontFamily: 'Montserrat SemiBold' }}>
                      ₹ {rs} {t('common:priceScreen.perLtr')}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold', alignSelf: 'center', marginTop: 20 }}>
                {t('common:priceScreen.price')} :
                </Text>
                <Text style={{ color: 'rgb(6,171,104)', fontFamily: 'Montserrat SemiBold', alignSelf: 'center', marginTop: 10, fontSize: 18 }}>
                  {
                    qty == null || qty == 0 ? null : `₹ ${qty * rs}`
                  }

                </Text>
              </View>
            </View>
            <Image style={{ height: 130, width: 130, borderWidth: 5, borderColor: '#fff', borderRadius: 65, alignSelf: 'center', position: 'absolute', marginTop: 130, }} source={require('../assets/mentha_oil.jpg')} />
          </View>
          {/* <View style={{height:400}}>
                    
            </View> */}
          {/* <View style={styles.gap}>
              <Text style={{ fontWeight: '600', fontSize: 20, color: 'green', }}>Mentha Oil</Text>
              <Text style={{ marginTop: 10, fontWeight: '600', fontSize: 15, color: '#000', }}>Submit Your Details</Text>
            </View> */}
          {/* {
              error
                ?
                <View style={{ alignSelf: 'center', marginTop: 50 }}>
                  <Text style={{ color: 'red' }}> {error} </Text>
                </View>
                :
                null
            } */}
          {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
            </View> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              qty
                ?
                setModalVisible(true)
                // console.log("qty --- ", qty)
                :
                updateError(`${t('common:priceScreen.pleaseEnterQuantity')}`, setError)
            }
            }
          >
            <Text style={{ fontSize: 17, color: '#ffffff', fontFamily: 'Montserrat SemiBold' }}>{t('common:priceScreen.locateCenter')}</Text>
          </TouchableOpacity>
          </View>
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
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 3, marginBottom: 100 }}>
              <View style={[styles.centeredView]}>
                <View style={{ height: 20, width: '100%', alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!modalVisible)
                      setPin()
                      setInputPin()
                      setFetchedPreviously(false)
                    }}
                  >
                    <Image style={{ height: 17, width: 17, marginRight: 5, marginTop: 5 }} source={require('../assets/close.png')} />
                  </TouchableOpacity>
                </View>
                <Text style={[{ color: '#000', alignSelf: 'center', paddingTop: 30, fontSize: 16, fontFamily: 'Montserrat Bold' }]}>{t('common:priceScreen.popUp.selectPinCode')}</Text>
                {/* <Text style={[{ color: '#000', alignSelf: 'center', paddingTop: 10, fontSize: 12 }]}>Click on search icon</Text> */}
                <View style={{ flexDirection: 'row', alignSelf: 'center', paddingTop: 15, padding: 30 }}>
                  <TextInput
                    placeholder={t('common:priceScreen.popUp.enterPinCode')}
                    // {t('common:priceScreen.popUp.')}
                    keyboardType='numeric'
                    placeholderTextColor="gray"
                    style={[styles.input, { width: '50%', backgroundColor: 'rgb(246,244,245)', }]}
                    value={inputPin}
                    onChangeText={(value) => {
                      setInputPin(value)
                      console.log(inputPin)
                    }}
                  />
                  <TouchableOpacity
                    // style={{ marginLeft: 5, marginTop: 12, height: 20, width: 20,alignSelf: 'center', }}
                    onPress={() => {
                      console.log("inputPin----- ", inputPin)
                      console.log("fetchedPin---------------", fetchedPin.length)
                      fetchPin(inputPin)
                    }}
                  >
                    <View style={{ backgroundColor: 'rgb(6,171,104)', height: 40, width: 40, justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                      <Image style={{ height: 20, width: 20, }} source={require('../assets/search.png')} />
                    </View>
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
                        <Text style={{ padding: 20, color: 'red', fontFamily: 'Montserrat SemiBold' }}>
                        {t('common:priceScreen.popUp.noCenterLocated')}
                        </Text>
                        :
                        fetchedPin.map((item, i) => {
                          const id = item.id
                          {/* console.log(id) */ }
                          return (
                            <View key={i} style={{ flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                              <RadioButton
                                value={id}
                                status={pin == id ? 'checked' : 'unchecked'}
                                onPress={() => {
                                  setPin(id)
                                  console.log(id)
                                  console.log(qty)
                                }}
                                color='rgb(6,171,104)'
                                uncheckedColor='#000'
                              />
                              <Text style={{ marginTop: 7, color: '#000', paddingRight: 20, fontFamily: 'Montserrat SemiBold' }}>
                                {item.address}
                              </Text>
                            </View>
                          )
                        })
                  }
                  <View style={{ height: 20 }}>

                  </View>
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
                      <Text style={{ color: '#fff', fontFamily: 'Montserrat SemiBold' }}>{t('common:priceScreen.popUp.continue')}</Text>
                    </TouchableOpacity>
                    :
                    null
                }
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: '45%',
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 10,
    backgroundColor: 'rgb(6,171,104)'
  },
  header: {
    backgroundColor: "rgba(242,210,125,255)",
    height: 200,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 63,
    position: 'absolute',
  },
  gap: {
    marginTop: 70,
    alignItems: 'center'
  },
  buttonModal: {
    height: 35,
    width: '50%',
    marginTop: 10,
    marginBottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 10,
    backgroundColor: 'rgb(6,171,104)'
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
    // height: 300,
    // position:'absolute',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 15
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    color: '#000'
  }
})


export default PriceScreen