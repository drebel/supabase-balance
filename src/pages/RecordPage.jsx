import React from "react"
import Instructions from "../components/Instructions"
import supabase from "../../utils/supabase"
import { Line } from 'react-chartjs-2'

import RealTimeWeightChart from '../components/RealTimeWeightChart'

export default function RecordPage(props){

    const connectedWBB = props.wiibalanceboard

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
            connectedWBB.WeightListener = handleWeightData
        }

        return () => {
            if(connectedWBB){
                connectedWBB.WeightListener = null
            }
        }
    }, [connectedWBB])

    async function handleWeightData(weights, timeStamp){
        // weights comes from weightPlotter if weightListener is truthy
        const payload= {
            user_id: props.session.user.id,
            board_id: connectedWBB.boardId,
            board_timestamp: timeStamp,
            event_timestamp: new Date().toISOString(),
            bottom_left_weight: weights.BOTTOM_LEFT,
            bottom_right_weight: weights.BOTTOM_RIGHT,
            top_left_weight: weights.TOP_LEFT,
            top_right_weight: weights.TOP_RIGHT,
        }
        
        if(payload.event_timestamp){



            setRealTimeWeightData(prevRealTimeWeightData => {
                const newLabels = [...prevRealTimeWeightData.labels, payload.event_timestamp]
                const newTopLeftData = [...prevRealTimeWeightData.datasets[0].data, weights.TOP_LEFT]
                const newTopRightData = [...prevRealTimeWeightData.datasets[1].data, weights.TOP_RIGHT]
                const newBottomLeftData = [...prevRealTimeWeightData.datasets[2].data, weights.BOTTOM_LEFT]
                const newBottomRightData = [...prevRealTimeWeightData.datasets[3].data, weights.BOTTOM_RIGHT]
                const newTotalWeightData = [...prevRealTimeWeightData.datasets[4].data, weights.TOP_LEFT + weights.TOP_RIGHT + weights.BOTTOM_LEFT + weights.BOTTOM_RIGHT]

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
        
        addDataToTimeSeriesDB(payload)

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



    function toggleLED() {
        // LED buttons
        if(connectedWBB){
            connectedWBB.toggleLed(0)
        }
    }

    function logClick(){
        console.log(props.session)
    }

    return (
        <>
            <h1>Record Page</h1>
            <button onClick={props.logClick}>click</button>
            {
                connectedWBB ?
                <>
                    <section>
                        <button onClick={toggleLED}>Toggle LED</button>
                        <Line data={realTimeWeightData}></Line>
                        {/* <RealTimeWeightChart data={realTimeWeightData}/> */}
                    </section>

                </>
                    :
                <Instructions handleFindBoard={props.handleFindBoard}/>
            }
        </>
    )
    
}