import React, { useState } from "react"
import Instructions from "../components/Instructions"
import supabase from "../../utils/supabase"
import { Line } from 'react-chartjs-2'

import RealTimeWeightChart from '../components/RealTimeWeightChart'

export default function RecordPage(props){

    const connectedWBB = props.wiibalanceboard
    const [wbbEvent, setWbbEvent] = useState({})
    const [isRecording, setIsRecording] = useState(false)

    const [realTimeWeightData, setRealTimeWeightData] = React.useState({
        labels: [],
        datasets: [
            {
                label: 'Top Left Sensor',
                data: [],
                borderColor: 'rgba(116,79,198,1)',
                backgroundColor: 'rgba(116,79,198,0.2)',
            },
            {
                label: 'Top Right Sensor',
                data: [],
                borderColor: 'rgba(79,134,198,1)',
                backgroundColor: 'rgba(79,134,198,0.2)',
            },
            {
                label: 'Bottom Left Sensor',
                data: [],
                borderColor: 'rgba(79,176,198,1)',
                backgroundColor: 'rgba(79,176,198,0.2)',
            },
            {
                label: 'Bottom Right Sensor',
                data: [],
                borderColor: 'rgba(55,147,146,1)',
                backgroundColor: 'rgba(55,147,146,0.2)',
            },
            {
                label: 'Total Weight',
                data: [],
                borderColor: 'rgba(23,48,28,1)', 
                backgroundColor: 'rgba(23,48,28,0.2)',
            },
        ],
    })
      

    React.useEffect(() => {
        if(connectedWBB){
            connectedWBB.WeightListener = hanldeWbbEvents
        }

        return () => {
            if(connectedWBB){
                connectedWBB.WeightListener = null
            }
        }
    }, [connectedWBB])

    React.useEffect(() => {
        //if the most recent wbb event has actual data in it, update the realtime data state with it
        if(wbbEvent.event_timestamp){
            setRealTimeWeightData(prevRealTimeWeightData => {
                const newLabels = [...prevRealTimeWeightData.labels, wbbEvent.event_timestamp]
                const newTopLeftData = [...prevRealTimeWeightData.datasets[0].data, wbbEvent.weights['TOP_LEFT']]
                const newTopRightData = [...prevRealTimeWeightData.datasets[1].data, wbbEvent.weights['TOP_RIGHT']]
                const newBottomLeftData = [...prevRealTimeWeightData.datasets[2].data, wbbEvent.weights['BOTTOM_LEFT']]
                const newBottomRightData = [...prevRealTimeWeightData.datasets[3].data, wbbEvent.weights['BOTTOM_RIGHT']]
                const newTotalWeightData = [...prevRealTimeWeightData.datasets[4].data, wbbEvent.weights['TOP_LEFT'] + wbbEvent.weights['TOP_RIGHT'] + wbbEvent.weights['BOTTOM_LEFT'] + wbbEvent.weights['BOTTOM_RIGHT']]
    
                if(newLabels.length > 100){
                    newLabels.shift()
                    newTopLeftData.shift()
                    newTopRightData.shift()
                    newBottomLeftData.shift()
                    newBottomRightData.shift()
                    newTotalWeightData.shift()
                }
    
                return (
                    {
                        labels: newLabels,
                        datasets: [
                            {
                                ...prevRealTimeWeightData.datasets[0],
                                data: newTopLeftData
                            },
                            {
                                ...prevRealTimeWeightData.datasets[1],
                                data: newTopRightData
                            },
                            {
                                ...prevRealTimeWeightData.datasets[2],
                                data: newBottomLeftData
                            },
                            {
                                ...prevRealTimeWeightData.datasets[3],
                                data: newBottomRightData
                            },
                            {
                                ...prevRealTimeWeightData.datasets[4],
                                data: newTotalWeightData
                            },
                        ] 
                    }  
                )
            })
        }
        
        // if user is recording, log the data to the db
        if(isRecording){
            const payload= {
                user_id: props.session.user.id,
                board_id: connectedWBB.boardId,
                board_timestamp: wbbEvent.timeStamp,
                event_timestamp: wbbEvent.event_timestamp,
                bottom_left_weight: wbbEvent.weights.BOTTOM_LEFT,
                bottom_right_weight: wbbEvent.weights.BOTTOM_RIGHT,
                top_left_weight: wbbEvent.weights.TOP_LEFT,
                top_right_weight: wbbEvent.weights.TOP_RIGHT,
            }
            // console.log(payload)
            addDataToTimeSeriesDB(payload)
        }
    },[wbbEvent, isRecording])

    // get the events from the weight listener and put it in react state
    function hanldeWbbEvents(weights, timeStamp){
        setWbbEvent({
            weights,
            timeStamp,
            event_timestamp: new Date().toISOString()
        })
    }

    async function addDataToTimeSeriesDB(newData){
        try{
            const { data , error } = await supabase
                .from('balance_board_data')
                .insert(newData)

            if(error){
                throw error
            }

            console.log('Data inserted successfully', data)

        }catch(error){
            console.error('Error inserting data:', error)
            throw error
        }
    }

    function toggleIsRecording(){
        setIsRecording(prevIsRecording => !prevIsRecording)
    }

    function toggleLED() {
        if(connectedWBB){
            connectedWBB.toggleLed(0)
        }
    }

    return (
        <>

        {
            connectedWBB ?
            <>
                <section className='bg-white pt-10'>
                    <div className='container mx-auto px-4 text-center bg-white rounded flex justify-center space-x-4'>                            
                        <button className='my-2 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700' onClick={toggleLED}>Toggle LED</button>
                        <button className='my-2 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700' onClick={toggleIsRecording}>{isRecording ? 'Stop Recording' : 'Start Recording' }</button>
                    </div>
                </section>
                <section className='bg-white py-10'>
                    <div className='container mx-auto px-4 text-center'>                            
                        <Line data={realTimeWeightData}></Line>
                    </div>
                </section>
            </>
            :
            <section className='bg-white py-20'>
                <div className='container mx-auto px-4 text-center'>                            
                    <Instructions handleFindBoard={props.handleFindBoard}/>
                </div>
            </section>
        }  
        </>
    )
    
}