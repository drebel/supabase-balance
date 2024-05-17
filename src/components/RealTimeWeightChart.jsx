import 'chart.js/auto'
import { Line } from 'react-chartjs-2'

export default function RealTimeWeightChart(props){
    
    // return props.realTimeWeightData.labels.length > 0 && realTimeWeightData.datasets.length > 0 ? (
    //     <Line data={props.realTimeWeightData} />
    // ) : (
    //     <p>Loading chart data...</p>
    // );
    return (
        <Line data={props.realTimeWeightData} />
    )
}