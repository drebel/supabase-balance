import { useEffect, useState } from 'react'
import { Chart as ChartJS,} from 'chart.js/auto'
  import { Line } from 'react-chartjs-2'
// import fetchDataForLast100 from '../../utils/fetch100'
import supabase from '../../utils/supabase'

export default function WeightOverTimeChart(props){
    const [weightData, setWeightData] = useState([])
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)


    async function fetchData(){ 
        // const interval = 3600000
        const interval = 86400000
        setLoading(true)
        
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
    
    // const chartOptions = {
    //     scales: {
    //       x: {
    //         type: "time",
    //         time: {
    //           unit: "second",
    //         },
    //       },
    //       y: {
    //         title: {
    //           display: true,
    //           text: "Weight (kg)",
    //         },
    //       },
    //     },
    //   }

    return(
        <>
            <section>  
                <button onClick={fetchData}>Fetch Last Interval</button>
            </section>
            <section>
                {loading && <div>Loading...</div>}
                {errorMessage && <div>{errorMessage}</div>}
                { chartData.labels.length === 0 && <h2>No data available for the selected interval</h2>
                }
                <Line data={chartData} />
            </section>
        </>
    )
}