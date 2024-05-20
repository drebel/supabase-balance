import WeightOverTimeChart from '../components/WeightOverTimeChart'

export default function DashboardPage(props){

    return (
        <section className='bg-white pt-10'> 
            <WeightOverTimeChart session={props.session}/>
        </section>
    )
}