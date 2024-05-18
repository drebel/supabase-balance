import 'chart.js/auto'
import { Line } from 'react-chartjs-2'

export default function RealTimeWeightChart(props){
    
    return (
        <Line data={props.realTimeWeightData} />
    )
}