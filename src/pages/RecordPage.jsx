import React from "react"
import Instructions from "../components/Instructions"
import LivePlotter from "../components/LivePlotter"
import supabase from "../../utils/supabase"

export default function RecordPage(props){

    const connectedWBB = props.wiibalanceboard

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
            boardId: connectedWBB.calibration,
            boardTimeStamp: timeStamp,
            time: new Date().toISOString(),
            bottom_left_weight: weights.BOTTOM_LEFT,
            bottom_right_weight: weights.BOTTOM_RIGHT,
            top_left_weight: weights.TOP_LEFT,
            top_right_weight: weights.TOP_RIGHT,
        }
        console.log(payload)
        
        // addDataToTimeSeriesDB(payload)

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
        console.log('click')
    }

    return (
        <>
            <h1>Record Page</h1>
            <button onClick={props.logClick}>click</button>
            {
                connectedWBB ?
                <LivePlotter 
                    toggleLED={toggleLED}
                    connectedWBB={connectedWBB}
                /> :
                <Instructions handleFindBoard={props.handleFindBoard}/>
            }
        </>
    )
    
}