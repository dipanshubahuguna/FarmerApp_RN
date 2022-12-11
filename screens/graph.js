import React, { Component, createRef, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, Animated, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg'
import * as shape from 'd3-shape'
import * as path from 'svg-path-properties'
import {
    scaleTime,
    scaleLinear,
    scaleQuantile
} from 'd3-scale';
import client from '../api/client';

const height = 200
const { width } = Dimensions.get('window')
import '../src/constants/DCSLocalize'
import { useTranslation } from 'react-i18next';


const d3 = {
    shape,
};

// const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

const monthsDict = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
}

const monthsDict2 = {
    'January': 1,
    'February': 2,
    'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
}

// const dataForGraph = [
//     { x: new Date(2022, 5, 16), y: 2600 },
//     { x: new Date(2022, 5, 15), y: 900 },
//     { x: new Date(2022, 5, 14), y: 1501 },
//     { x: new Date(2022, 5, 13), y: 950 },
//     { x: new Date(2022, 5, 12), y: 1201 },
//     { x: new Date(2022, 5, 11), y: 1000 },
// ];

const Graph = ({ dataForGraph,ddaattee }) => {

    const [graphData, setGraphData] = useState([])
    const [DATEArr, setDateArr] = useState([]) 

    console.log("dataForGraph ................................. dataForGraph ", dataForGraph)
    // console.log("graphData ................................. graphData       ", graphData)
    // graphData.map((item, i) => {
    //     console.log(i, " ", String(item.x).split("-"))
    // })

    const { t, i18n } = useTranslation()
    const monthsList = [`${t('common:monthList.jan')}`,
    `${t('common:monthList.feb')}`,
    `${t('common:monthList.mar')}`,
    `${t('common:monthList.apr')}`,
    `${t('common:monthList.may')}`,
    `${t('common:monthList.jun')}`,
    `${t('common:monthList.july')}`,
    `${t('common:monthList.aug')}`,
    `${t('common:monthList.sept')}`,
    `${t('common:monthList.oct')}`,
    `${t('common:monthList.nov')}`,
    `${t('common:monthList.dec')}`,
    ]

    var dict = {}

    let GRAPH_DATA_TO_SHOW = []
    let dateArray = []




    dataForGraph.map((item, i) => {
        // console.log(i,item)
        console.log("split")
        console.log(i)
        const d = String(item.x).split("-")
        console.log(d)
        let month = monthsDict[d[0].split(" ")[1]]
        let date = d[0].split(" ")[2]
        let year = d[0].split(" ")[3]
        // console.log(month,date,year)
        dict[new Date(year, month, date)] = item.y
        dateArray.push({ year, month, date })
    })


    console.log("dateArray", dateArray)
    
    let dateArray2 = []


    // graphData.map((item, i) => {
    //     // console.log(i,item)
    //     console.log("split2")
    //     console.log(i)
    //     const d = (item.x).split("-")
    //     console.log(d)
    //     let month = monthsDict2[d[0].split(" ")[1]]
    //     let date = d[0].split(" ")[2]
    //     let year = d[0].split(" ")[3]
    //     // console.log(month,date,year)
    //     dict[new Date(year, month, date)] = item.y
    //     dateArray2.push({ year, month, date })

    // })

    // let dattaa = "2022-12-15T18:30:00.000Z"
    // console.log(dattaa.split('-'))
    // console.log(dattaa.split('-'))
    // console.log(dattaa.split('-'))

    // console.log("dateArray2", dateArray2)

    // console.log("dateArray",dateArray[0].year, dateArray[0].month, dateArray[0].date)
    // console.log("dateArray",dateArray[1].year, dateArray[1].month, dateArray[1].date)
    // console.log("dateArray",dateArray[2].year, dateArray[2].month, dateArray[2].date)
    // console.log("dateArray",dateArray[3].year, dateArray[3].month, dateArray[3].date)
    // console.log("dateArray",dateArray[4].year, dateArray[4].month, dateArray[4].date)
    // console.log("dateArray",dateArray[5].year, dateArray[5].month, dateArray[5].date)

    let max = 0
    let min = 1e9
    dataForGraph.map(val => {
        // val.y
        // console.log("values")
        // console.log((val.y))
        max <= val.y ? max = val.y : max = max
        min >= val.y ? min = val.y : min = min
    })
    const cursor = createRef()
    const label1 = createRef()
    const label2 = createRef()

    // console.log("max",max,"min",min)
    // console.log("Date Arrrrrrrrrrrrrrrrrrrray2")
    // console.log(dateArray2[0].year, dateArray2[0].month, dateArray2[0].date)
    const scaleX = scaleTime().domain([new Date(dateArray[0].year, dateArray[0].month, dateArray[0].date), new Date(dateArray[5].year, dateArray[5].month, dateArray[5].date),]).range([0, width]);
    const scaleY = scaleLinear().domain([min, max]).range([150, 50 - 0]);

    const line = d3.shape.line()
        .x(d => scaleX(d.x))
        .y(d => scaleY(d.y))
        .curve(d3.shape.curveBasis)(dataForGraph);


    const properties = path.svgPathProperties(line);
    const lineLength = properties.getTotalLength()


    // console.log()

    const scaleLabel = scaleQuantile().domain([min, max]).range([900, 2600]);
    const scaleLabelX = scaleQuantile().domain([new Date(dateArray[0].year, dateArray[0].month, dateArray[0].date),
    new Date(dateArray[1].year, dateArray[1].month, dateArray[1].date),
    new Date(dateArray[2].year, dateArray[2].month, dateArray[2].date),
    new Date(dateArray[3].year, dateArray[3].month, dateArray[3].date),
    new Date(dateArray[4].year, dateArray[4].month, dateArray[4].date),
    new Date(dateArray[5].year, dateArray[5].month, dateArray[5].date),])
        .range([new Date(dateArray[0].year, dateArray[0].month, dateArray[0].date),
        new Date(dateArray[1].year, dateArray[1].month, dateArray[1].date),
        new Date(dateArray[2].year, dateArray[2].month, dateArray[2].date),
        new Date(dateArray[3].year, dateArray[3].month, dateArray[3].date),
        new Date(dateArray[4].year, dateArray[4].month, dateArray[4].date),
        new Date(dateArray[5].year, dateArray[5].month, dateArray[5].date),
        ]);
    // console.log("scaleLabelX(0)",scaleLabelX(0))
    // console.log("scaleLabel",scaleLabel(2))



    // console.log("DATA from mainscreen.js--------", data)
    const state = {
        x: new Animated.Value(0)
    }
    // const [graphData, setGraphData] = useState()
    const { x } = state
    const translateX = x.interpolate({
        inputRange: [0, Math.floor(lineLength)],
        outputRange: [0, 0],
        extrapolate: 'clamp'
    })


    // console.log(cursor)
    // console.log(label1)
    const moveCursor = (value) => {
        // console.log('reached moveCursor')
        const { x, y } = properties.getPointAtLength(lineLength - value - 35)
        // console.log("x -----------------------------------------------------------",x)
        // console.log(cursor)
        cursor.current.setNativeProps({ top: y - 75, left: x, height: 150 })
        const valY = scaleLabel(scaleY.invert(y))
        const valX = scaleLabelX(scaleX.invert(x))
        // console.log("valx", String(valX))
        // console.log("valX --- ", valX)
        // console.log("valY --- ", valY)
        let d = String(valX).split("-")
        let day = d[0].split(" ")[0]
        let month = monthsList[monthsDict[d[0].split(" ")[1]] - 1]
        let date = d[0].split(" ")[2]
        let year = d[0].split(" ")[3]

        // console.log(day)
        // console.log(month)
        // console.log(date)
        // console.log(year)
        label1.current.setNativeProps({ text: ` ₹ ${dict[valX]} ` })
        label2.current.setNativeProps({ text: ` ${month}-${date}-${year}  ` })
    }

    const fetchApi = async () => {
        const token = await AsyncStorage.getItem('token')

        try {
            const res = await client.get('/day-selling-graph', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("from graph.js ------", res.data.data)

            res.data.data.map((item, i) => {
                // console.log(i,item)
                console.log("split2")
                console.log(i)
                const d = (item.x).split("-")
                console.log(d)
                let month = monthsDict2[d[0].split(" ")[1]]
                let date = d[0].split(" ")[2]
                let year = d[0].split(" ")[3]
                // console.log(month,date,year)
                dict[new Date(year, month, date)] = item.y
                dateArray2.push({ year, month, date })

        
            })

            console.log("dateArray2 --",dateArray2)

            setDateArr(dateArray2)
             
            console.log('setDateArr',DATEArr)
            
            // setGgdata(res.data.data)

            // res.data.data.map((item, i) => {
            //     let month, date, year
            //     let dateArr = item.date.split('-')
            //     // console.log(item.date.split('-'),i);
            //     console.log(item.price)
            //     dataForGraph.push({ x: new Date(dateArr[0], dateArr[1], dateArr[2]), y: item.price })
            // })

            // setGraphData(() => {
            //     return resp.data
            // })

            // console.log(dataForGraph)
            // console.log("graphData", graphData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // console.log('reached')
        fetchApi()
        state.x.addListener(({ value }) => moveCursor(value))
        moveCursor(0)
    },[])

    return (
        <View style={{ height: 350, borderColor: '#000', width: width, alignSelf: 'center', marginTop: 20, backgroundColor: 'rgba(249,249,249,255)' }}>
            <View style={{ marginTop: 20 }}>
                <Svg {...{ height: 200, width }}>
                    <Defs>
                        <LinearGradient x1="50%" y1="30%" x2="50%" y2="70%" id="gradient">
                            <Stop stopColor="rgb(255,120,42)" offset="30%" />
                            {/* <Stop stopColor="rgb(255,120,42)" offset="20%" /> */}
                            <Stop stopColor="rgb(255,199,168)" offset="70%" />
                            <Stop stopColor="rgb(255,240,245)" offset="90%" />
                        </LinearGradient>
                    </Defs>
                    <Path d={line} fill="transparent" stroke="rgb(191,74,8)" strokeWidth={5} />
                    <Path d={`${line} L ${width} ${200} L 0 ${200}`} fill="url(#gradient)" />
                    <View style={[{
                        height: '50%', width: 0.1, borderWidth: 0.5, borderColor: 'gray', borderStyle: 'dashed', justifyContent: 'center'
                    }]}
                        ref={cursor}
                    >
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderColor: 'rgb(250,93,5)',
                            borderWidth: 5,
                            backgroundColor: '#fff',
                            alignSelf: 'center'
                        }}>
                        </View>
                    </View>
                </Svg>
                <Animated.View style={[{
                    position: 'absolute',
                    top: -20,
                    left: 0,
                    width: '40%'
                }, { transform: [{ translateX }] }]}>
                    <TextInput
                        style={{ color: '#000', fontFamily: 'Montserrat Bold' }}
                        ref={label1}
                    />
                    <TextInput
                        style={{ color: 'rgba(9,170,103,255)', marginTop: -30, fontFamily: 'Montserrat Bold' }}
                        ref={label2}
                    />
                </Animated.View>
                <Animated.ScrollView
                    style={StyleSheet.absoluteFill}
                    contentContainerStyle={{ width: lineLength * 2 }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    bounces={false}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x },
                                },
                            },
                        ],
                        { useNativeDriver: true },
                    )}
                    horizontal
                />
            </View>
            <View style={{ width: width - 10, height: 70, justifyContent: 'center', flexDirection: 'row', alignSelf: 'center', alignItems: "center" }}>
                {
                    dateArray.map((item, i) => {
                        console.log(item)
                        return (
                            <View key={i} style={{ width: '16.67%', alignItems: 'center' }}>
                                <Text style={{ color: '#000', fontFamily: 'Montserrat Bold', fontSize: 15 }}>
                                    {item.date}{" "}
                                    {monthsList[item.month - 1]}
                                </Text>
                                <Text style={{ color: '#000', fontFamily: 'Montserrat SemiBold', fontSize: 10 }}>
                                    {item.year}
                                </Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

export default Graph



// import React, { Component, createRef, useCallback, useEffect, useRef, useState } from 'react';
// import { View, Text, Dimensions, Animated, StyleSheet, TextInput } from 'react-native';
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg'
// import * as shape from 'd3-shape'
// import * as path from 'svg-path-properties'
// import {
//     scaleTime,
//     scaleLinear,
//     scaleQuantile
// } from 'd3-scale';
// import client from '../api/client';

// const height = 200
// const { width } = Dimensions.get('window')

// const d3 = {
//     shape,
// };

// const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

// const monthsDict = {
//     'Jan': 0,
//     'Feb': 1,
//     'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sept': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
// }
// const Graph = ({ data, graphData }) => {

//     var dict = {}
//     // var dictt = {}

//     // let maxDate = String(graphData[0].x).split(" ")[2]
//     // let maxMonth = monthsDict[String(graphData[0].x).split(" ")[1]] - 1
//     // let maxYear = String(graphData[0].x).split(" ")[3]
//     let GRAPH_DATA = []
//     let totalValToSHowOnGraph = 0
//     graphData.map((item, i) => {
//         totalValToSHowOnGraph <= 5 ? GRAPH_DATA.push(item) : null
//         totalValToSHowOnGraph = totalValToSHowOnGraph + 1;
//     })
//     // console.log("GRAPH_DATA ./////././.../.",GRAPH_DATA)
//     let GRAPH_DATA_TO_SHOW = []
//     // console.log("GRAPH_DATA_TO_SHOW in graph.js //////////// ",GRAPH_DATA_TO_SHOW)
//     GRAPH_DATA_TO_SHOW = [...GRAPH_DATA].reverse()
//     // console.log("GRAPH_DATA_TO_SHOW in graph.js //////////// ",GRAPH_DATA_TO_SHOW)
//     // console.log("data in graph.js ////////////// ",data)

//     let dateArray = []
//     // let dateeArray = []

//     let dataForGraph = []
//     // let yValue = GRAPH_DATA_TO_SHOW[5].y
//     // console.log(yValue)
//     let price = GRAPH_DATA_TO_SHOW[5].y
//     let found = -1
//     let foundAt = -1
//     for (let i = 5; i >= 0; --i) {
//         // console.log("price --------  1  ---------- ",price)
//         // console.log("GRAPH_DATA_TO_SHOW[i].x ------------  2  ---------- ",GRAPH_DATA_TO_SHOW[i].x)
//         // console.log("data[i].x ------------  3  ---------- --------------",data[i].x)
//         let date = String(data[i].x)
//         for (let j = 5; j >= 0; --j) {
//             // console.log("entered")
//             // console.log(GRAPH_DATA_TO_SHOW[j].x)
//             if (date === String(GRAPH_DATA_TO_SHOW[j].x)) {
//                 price = GRAPH_DATA_TO_SHOW[j].y
//                 found = i
//                 foundAt = j
//                 // console.log(date, " == ",String(GRAPH_DATA_TO_SHOW[j].x)," ",true)
//             } else {
//                 // console.log(date, " == ",String(GRAPH_DATA_TO_SHOW[j].x)," ",false)
//             }
//         }
//         // if(GRAPH_DATA_TO_SHOW[i].x == data[i].x){
//         //     price = GRAPH_DATA_TO_SHOW[i].y
//         // }
//         // console.log("found",found)
//         // console.log("foundAt",foundAt)
//         if (found != i && found == -1) price = GRAPH_DATA_TO_SHOW[5].y
//         else if (found != i) {
//             price = GRAPH_DATA_TO_SHOW[foundAt - 1].y
//         }
//         dataForGraph[i] = { x: data[i].x, y: price }
//     }

//     // console.log("dataForGraph ./././.././././././",dataForGraph)

//     let count = 0
//     // graphData.map((item,i) =>{

//     //     dictt[new Date(maxYear,maxMonth,maxDate - count)] = item.y
//     //     count=count+1
//     //     let date = maxDate - count
//     //     let month = maxMonth
//     //     let year = maxYear
//     //     dateeArray.push({year,month,date})
//     //     console.log("dictt ////////////////////////",dictt)
//     // })

//     // console.log("dateeArray",dateeArray.reverse())


//     dataForGraph.map((item, i) => {
//         // console.log(i,item)
//         const d = String(item.x).split("-")
//         let month = monthsDict[d[0].split(" ")[1]]
//         let date = d[0].split(" ")[2]
//         let year = d[0].split(" ")[3]
//         // console.log(month,date,year)
//         dict[new Date(year, month, date)] = item.y
//         dateArray.push({ year, month, date })
//     })
//     // console.log("dateArray",dateArray)


//     // console.log("dateArray",dateArray[0].year, dateArray[0].month, dateArray[0].date)
//     // console.log("dateArray",dateArray[1].year, dateArray[1].month, dateArray[1].date)
//     // console.log("dateArray",dateArray[2].year, dateArray[2].month, dateArray[2].date)
//     // console.log("dateArray",dateArray[3].year, dateArray[3].month, dateArray[3].date)
//     // console.log("dateArray",dateArray[4].year, dateArray[4].month, dateArray[4].date)
//     // console.log("dateArray",dateArray[5].year, dateArray[5].month, dateArray[5].date)

//     let max = 0
//     let min = 1e9
//     dataForGraph.map(val => {
//         // val.y
//         // console.log("values")
//         // console.log((val.y))
//         max <= val.y ? max = val.y : max = max
//         min >= val.y ? min = val.y : min = min
//     })
//     const cursor = createRef()
//     const label1 = createRef()
//     const label2 = createRef()

//     // console.log("max",max,"min",min)

//     const scaleX = scaleTime().domain([new Date(dateArray[0].year, dateArray[0].month, dateArray[0].date), new Date(dateArray[5].year, dateArray[5].month, dateArray[5].date),]).range([0, width]);
//     const scaleY = scaleLinear().domain([min, max]).range([150, 50 - 0]);

//     const line = d3.shape.line()
//         .x(d => scaleX(d.x))
//         .y(d => scaleY(d.y))
//         .curve(d3.shape.curveBasis)(dataForGraph);


//     const properties = path.svgPathProperties(line);
//     const lineLength = properties.getTotalLength()


//     // console.log()

//     const scaleLabel = scaleQuantile().domain([min, max]).range([900, 2600]);
//     const scaleLabelX = scaleQuantile().domain([new Date(dateArray[0].year, dateArray[0].month, dateArray[0].date),
//     new Date(dateArray[1].year, dateArray[1].month, dateArray[1].date),
//     new Date(dateArray[2].year, dateArray[2].month, dateArray[2].date),
//     new Date(dateArray[3].year, dateArray[3].month, dateArray[3].date),
//     new Date(dateArray[4].year, dateArray[4].month, dateArray[4].date),
//     new Date(dateArray[5].year, dateArray[5].month, dateArray[5].date),])
//         .range([new Date(dateArray[0].year, dateArray[0].month, dateArray[0].date),
//         new Date(dateArray[1].year, dateArray[1].month, dateArray[1].date),
//         new Date(dateArray[2].year, dateArray[2].month, dateArray[2].date),
//         new Date(dateArray[3].year, dateArray[3].month, dateArray[3].date),
//         new Date(dateArray[4].year, dateArray[4].month, dateArray[4].date),
//         new Date(dateArray[5].year, dateArray[5].month, dateArray[5].date),
//         ]);
//     // console.log("scaleLabelX(0)",scaleLabelX(0))
//     // console.log("scaleLabel",scaleLabel(2))



//     // console.log("DATA from mainscreen.js--------", data)
//     const state = {
//         x: new Animated.Value(0)
//     }
//     // const [graphData, setGraphData] = useState()
//     const { x } = state
//     const translateX = x.interpolate({
//         inputRange: [0, Math.floor(lineLength)],
//         outputRange: [width - 90, 0],
//         extrapolate: 'clamp'
//     })


//     // console.log(cursor)
//     // console.log(label1)
//     const moveCursor = (value) => {
//         // console.log('reached moveCursor')
//         const { x, y } = properties.getPointAtLength(lineLength - value - 35)
//         // console.log("x -----------------------------------------------------------",x)
//         // console.log(cursor)
//         console.log("x", " y ", x, y)
//         // console.log(cursor.current)
//         cursor.current.setNativeProps({ top: y - 75,left: x ,height: 150})
//         const valY = scaleLabel(scaleY.invert(y))
//         const valX = scaleLabelX(scaleX.invert(x))
//         // console.log("valx", String(valX))
//         // console.log("valX --- ", valX)
//         // console.log("valY --- ", valY)
//         let d = String(valX).split("-")
//         let day = d[0].split(" ")[0]
//         let month = monthsList[monthsDict[d[0].split(" ")[1]] - 1]
//         let date = d[0].split(" ")[2]
//         let year = d[0].split(" ")[3]

//         // console.log(day)
//         // console.log(month)
//         // console.log(date)
//         // console.log(year)
//         label1.current.setNativeProps({ text: ` ₹ ${dict[valX]} ` })
//         label2.current.setNativeProps({ text: ` ${date}-${month}-${year}` })
//     }

//     // const fetchApi = async () => {
//     //     // const token = await AsyncStorage.getItem('token')

//     //     try {
//     //         const res = await fetch('https://printrly.com/public/api/day-selling', {
//     //             headers: {
//     //                 Authorization: `Bearer 370|0fAiQ57ycExJgZvsTln8XwzF8o1kZWjdLmR4QgHp`
//     //             }
//     //         })
//     //         const resp = await res.json()
//     //         // console.log("from graph.js ------", resp.data)
//     //         setGraphData(() => {
//     //             return resp.data
//     //         })
//     //         // console.log("graphData", graphData)
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }

//     useEffect(() => {
//         // console.log('reached')
//         // fetchApi()
//         state.x.addListener(({ value }) => moveCursor(value))
//         moveCursor(0)
//     },[cursor])

//     return (
//         <View style={{ height: 280, borderColor: '#000', width: width - 20, alignSelf: 'center', marginTop: 20, backgroundColor: 'rgba(249,249,249,255)',borderRadius:5 }}>
//             <View style={{ marginTop: 20}}>
//                 <Svg {...{ height: 180, width: width - 20}}>
//                     <Defs>
//                     <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
//                             <Stop stopColor="rgba(254,138,53,255)" offset="0%" />
//                             <Stop stopColor="#fceae3" offset="80%" />
//                             <Stop stopColor="#FEFFFF" offset="100%" />
//                         </LinearGradient>
//                         {/* <LinearGradient x1="50%" y1="30%" x2="50%" y2="70%" id="gradient">
//                             <Stop stopColor="rgb(255,120,42)" offset="0%" />
//                             <Stop stopColor="rgb(255,120,42)" offset="20%" />
//                             <Stop stopColor="rgb(255,199,168)" offset="50%" />
//                             <Stop stopColor="rgb(255,240,231)" offset="80%" />
//                         </LinearGradient> */}
//                     </Defs>
//                     <Path d={line} fill="transparent" stroke="rgb(191,74,8)" strokeWidth={5} />
//                     <Path d={`${line} L ${width} ${200} L 0 ${200}`} fill="url(#gradient)" />
                    // <View style={[{
                    //     height: '50%', width: 0.1, borderWidth: 0.5, borderColor: 'gray', borderStyle: 'dashed', justifyContent: 'center'
                    // }]}
                    //     ref={cursor}
                    // >
                    //     <View style={{
                    //         width: 20,
                    //         height: 20,
                    //         borderRadius: 10,
                    //         borderColor: 'rgb(250,93,5)',
                    //         borderWidth: 5,
                    //         backgroundColor: '#fff',
                    //         alignSelf: 'center'
                    //     }}>
                    //     </View>
                    // </View>
//                 </Svg>
//                 <Animated.View style={[{
//                     position: 'absolute',
//                     top: -20,
//                     left: 0,
//                     width: 90,
//                 }]}>
//                     <TextInput
//                         style={{ color: '#000', fontFamily: 'Montserrat Bold',fontSize:15 }}
//                         ref={label1}
//                     />
//                     <TextInput
//                         style={{ color: 'rgba(9,170,103,255)', marginTop: -30,fontSize:12, fontFamily: 'Montserrat Bold' }}
//                         ref={label2}
//                     />
//                 </Animated.View>
//                 <Animated.ScrollView
//                     style={StyleSheet.absoluteFill}
//                     contentContainerStyle={{ width: lineLength * 2 - 15 }}
//                     showsHorizontalScrollIndicator={false}
//                     scrollEventThrottle={16}
//                     bounces={false}
//                     onScroll={Animated.event(
//                         [
//                             {
//                                 nativeEvent: {
//                                     contentOffset: { x },
//                                 },
//                             },
//                         ],
//                         { useNativeDriver: true },
//                     )}
//                     horizontal
//                 />
//             </View>
            // <View style={{ width: width - 10,height: 70, justifyContent: 'center', flexDirection: 'row',alignSelf:'center',alignItems:"center" }}>
            //     {
            //         dateArray.map((item, i) => {
            //             console.log(item)
            //             return (
            //                 <View key={i} style={{ width:'16.67%',alignItems:'center' }}>
            //                     <Text style={{ color: '#000',fontFamily:'Montserrat Bold',fontSize:15}}>
            //                         {item.date}{" "}
            //                         {monthsList[item.month - 1]}
            //                     </Text>
            //                     <Text style={{ color: '#000',fontFamily:'Montserrat SemiBold',fontSize:10 }}>
            //                         {item.year}
            //                     </Text>
            //                 </View>
            //             )
            //         })
            //     }
            // </View>
//         </View>
//     )
// }

// export default Graph