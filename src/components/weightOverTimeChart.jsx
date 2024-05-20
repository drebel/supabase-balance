import { useEffect, useState } from 'react'
import { Chart as ChartJS,} from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import supabase from '../../utils/supabase'

export default function WeightOverTimeChart(props){
    // const [userId, setUserId] = useState(null)
    const [weightData, setWeightData] = useState([])
    const [selectedIntervalValue, setSelectedIntervalValue] = useState(60000)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        fetchData()
    }, [selectedIntervalValue])


    async function fetchData(){ 
        if (!props.session || !props.session.user) {
            console.error('Session or user is null');
            return;
        }
        
        const interval = selectedIntervalValue

        setLoading(true)
        setErrorMessage(null)
        
        try {
            let allData = []
            let { data , error } = await supabase
                .from('balance_board_data')
                .select('event_timestamp, bottom_left_weight, bottom_right_weight, top_left_weight, top_right_weight')
                .eq('user_id', props.session.user.id)
                .gt('event_timestamp', new Date(Date.now() - interval).toISOString())
                .order('event_timestamp', { ascending: true})
            if(error){
                throw error
            }

            if (data.length > 0) { // Only append if data is not empty
                allData.push(...data);
            }
            console.log('alldata 1', allData)

            while (data.length === 1000){
                const lastTimestamp = data[data.length - 1].event_timestamp
                console.log(lastTimestamp)

                const { data: moreData, error } = await supabase
                    .from('balance_board_data')
                    .select('event_timestamp, bottom_left_weight, bottom_right_weight, top_left_weight, top_right_weight')
                    .eq('user_id', props.session.user.id)
                    .gt('event_timestamp', lastTimestamp)
                    .order('event_timestamp', { ascending: true})
                    .limit(1000)

                if (error) {
                    throw error;
                }
                console.log('moreData', moreData)

                allData = [...allData, ...moreData];
                console.log('allData', allData)
                data = moreData
            }


            console.log(`Last ${interval} data`, data)
            setWeightData(allData)
        } catch (error) {
            console.error('Error fetching data', error)
            setErrorMessage('Failed to fetch data')
        }finally {
        setLoading(false)  // Set loading to false after fetching data
        }
    }


    const chartData = {
        labels: weightData.map(entry => entry.event_timestamp),
        datasets: [
            {
                label: 'Top Left Sensor',
                data: weightData.map(entry => entry.top_left_weight),
                borderColor: 'rgba(116,79,198,1)',
                backgroundColor: 'rgba(116,79,198,0.2)',
            },
            {
                label: 'Top Right Sensor',
                data: weightData.map(entry => entry.top_right_weight),
                borderColor: 'rgba(79,134,198,1)',
                backgroundColor: 'rgba(79,134,198,0.2)',
            },
            {
                label: 'Bottom Left Sensor',
                data: weightData.map(entry => entry.bottom_left_weight),
                borderColor: 'rgba(79,176,198,1)',
                backgroundColor: 'rgba(79,176,198,0.2)',
            },
            {
                label: 'Bottom Right Sensor',
                data: weightData.map(entry => entry.bottom_right_weight),
                borderColor: 'rgba(55,147,146,1)',
                backgroundColor: 'rgba(55,147,146,0.2)',
            },
            {
                label: "Total Weight",
                data: weightData.map(entry => entry.bottom_left_weight + entry.bottom_right_weight + entry.top_left_weight + entry.top_right_weight),
                borderColor: 'rgba(23,48,28,1)', 
                backgroundColor: 'rgba(23,48,28,0.2)',
                fill: false,
            },
        ]
    }
    
    function handleSelectChange(e){
        setSelectedIntervalValue(e.target.value)
    }

    async function fetchMostRecent(){
        if (!props.session || !props.session.user) {
            console.error('Session or user is null');
            return;
        }
        
        setLoading(true)
        setErrorMessage(null)
        
        try {
            let { data , error } = await supabase
                .from('balance_board_data')
                .select('event_timestamp, bottom_left_weight, bottom_right_weight, top_left_weight, top_right_weight')
                .eq('user_id', props.session.user.id)
                .order('event_timestamp', { ascending: false})
                .limit(1000)
            if(error){
                throw error
            }

            data.reverse()

            if (data.length > 0) {
                setWeightData(data)
            }
        } catch (error) {
            console.error('Error fetching data', error)
            setErrorMessage('Failed to fetch data')
        }finally {
        setLoading(false) 
        }
    }

    return(
        <>
            <div className='container mx-auto px-4 text-center bg-white rounded flex py-4'>
                <div className='mx-auto flex flex-row items-center justify-center space-y-0 space-x-4'>
                    <button className='my-2 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700' onClick={fetchMostRecent}>Get last recorded ~20s</button>
                    <div>or</div>
                    <div>
                        <label htmlFor="intervalSelect" >Get recordings in the last: </label> 
                        <select id='intervalSelect' value={selectedIntervalValue} onChange={handleSelectChange}>
                            <option value="60000">minute</option>
                            <option value="600000">10 minutes</option>
                            <option value="1800000">30 minutes</option>
                            <option value="3600000">hour</option>
                            <option value="86400000">day (slow)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='container mx-auto px-4 text-center bg-white rounded flex justify-center space-x-4'>
                <div>               
                    {loading && <span>Loading...</span>}
                    {errorMessage && <span>{errorMessage}</span>}
                </div>
                <div>
                    { !loading && chartData.labels.length === 0 && <span>No data available for the selected interval</span>
                    }
                    { weightData.length !== 0 && <span>Loaded {weightData.length} data points</span>}
                </div>
            </div>
                
            <div className='container mx-auto px-4 text-center bg-white rounded flex justify-center space-x-4'> 
                <Line data={chartData} />
            </div>
        </>
    )
}