import { useEffect, useState } from 'react'
import { Chart as ChartJS,} from 'chart.js/auto'
  import { Line } from 'react-chartjs-2'
// import fetchDataForLast100 from '../../utils/fetch100'
import supabase from '../../utils/supabase'

export default function WeightOverTimeChart(props){
    const [weightData, setWeightData] = useState([])

    async function fetchDataForLast100(){        
        try {
            const { data , error } = await supabase
                .from('balance_board_data')
                .select('event_timestamp, bottom_left_weight, bottom_right_weight, top_left_weight, top_right_weight')
                .eq('user_id', props.session.user.id)
                .order('event_timestamp', { ascending: false})
                .limit(2000)
    
            if(error){
                throw error
            }

            data.reverse()

            console.log("Data for last 100 rows", data)
            setWeightData(data)
        } catch (error) {
            console.error('Error fetching data', error)
        }
    }

    const chartData = {
        labels: weightData.map(entry => entry.event_timestamp),
        datasets: [
            {
                label: "Total Weight",
                data: weightData.map(entry => entry.bottom_left_weight + entry.bottom_right_weight + entry.top_left_weight + entry.top_right_weight),
                borderColor: "rgba(75, 192, 192, 1)",
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
                <button onClick={fetchDataForLast100}>Fetch Last 100</button>
            </section>
            <Line data={chartData} />
        </>
    )
}