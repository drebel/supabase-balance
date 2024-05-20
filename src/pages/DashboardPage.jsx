import HistoricWeightChart from '../components/HistoricWeightChart'

export default function DashboardPage(props){

    return (
        <section className='bg-white pt-10'> 
            <HistoricWeightChart session={props.session}/>
        </section>
    )
}