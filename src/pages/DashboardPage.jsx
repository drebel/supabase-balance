import WeightOverTimeChart from '../components/WeightOverTimeChart'

export default function DashboardPage(props){

    return (
        <section>
            <WeightOverTimeChart session={props.session}/>
        </section>
    )
}