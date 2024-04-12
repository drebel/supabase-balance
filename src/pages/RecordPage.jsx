import Instructions from "../components/Instructions"
import LivePlotter from "../components/LivePlotter"

export default function RecordPage(props){

    const connectedWBB = props.wiibalanceboard

    function toggleLED() {
        // LED buttons
        props.wiibalanceboard.toggleLed(0)
    }

    function logClick(){
        console.log('click')
    }

    return (
        <>
            <h1>Record Page</h1>
            <button onClick={props.handleFindBoard}>click</button>
            {
                connectedWBB ?
                <LivePlotter /> :
                <Instructions handleFindBoard={props.handleFindBoard}/>
            }
        </>
    )
    
}