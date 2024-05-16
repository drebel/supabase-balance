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
            user_id: props.session.user.id,
            board_id: connectedWBB.boardId,
            board_timestamp: timeStamp,
            event_timestamp: new Date().toISOString(),
            bottom_left_weight: weights.BOTTOM_LEFT,
            bottom_right_weight: weights.BOTTOM_RIGHT,
            top_left_weight: weights.TOP_LEFT,
            top_right_weight: weights.TOP_RIGHT,
        }
        // console.log(payload)
        
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

    async function fetchDataForLast100(){
        try {
            const { data , error } = await supabase
                .from('balance_board_data')
                .select('*')
                .order('event_timestamp', { ascending: false})
                .limit(100)

            if(error){
                throw error
            }

            console.log("Data for last 100 rows", data)
        } catch (error) {
            console.error('Error fetching data', error)
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
                    <button onClick={fetchDataForLast100}>Fetch Last 100</button>
                    <LivePlotter 
                        toggleLED={toggleLED}
                        connectedWBB={connectedWBB}
                    /> 
                </>
                    :
                <Instructions handleFindBoard={props.handleFindBoard}/>
            }
        </>
    )
    
}