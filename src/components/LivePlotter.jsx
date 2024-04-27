import React from 'react'

export default function LivePlotter(props){

    const [showLiveData, setShowLiveData] = React.useState(false)

    const canvasRef = React.useRef(null)



    React.useEffect(() => {
        function drawPlot(){
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            function plotLiveData() {
                props.connctedWBB.WeightListener = weights => {
                  let totalWeight = weights.TOP_RIGHT + weights.BOTTOM_RIGHT + weights.TOP_LEFT + weights.BOTTOM_LEFT
                  // console.log(totalWeight)
              
                  let xValue = (1 + ((weights.TOP_RIGHT + weights.BOTTOM_RIGHT) - (weights.TOP_LEFT + weights.BOTTOM_LEFT)) / (totalWeight)) * (433)
              
                  let yValue = (1 + ((weights.BOTTOM_RIGHT + weights.BOTTOM_LEFT) - (weights.TOP_RIGHT + weights.TOP_LEFT)) / (totalWeight)) * (238)
              
                  ctx.strokeRect(xValue,yValue,5,5)
                  // console.log(xValue,yValue)
                }
              }    
              
              plotLiveData()
        }
    },[])



    function toggleLiveData(){
        setShowLiveData(!showLiveData)
        if(showLiveData){
            plotLiveData()
        }
    }

    return (
        <div
        id="livePlotter"
        className="max-w-4xl mx-auto px-8 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
            <h1>Live Plotter</h1>
            <div id="canvasholder" className="mt-2 max-w-4xl mx-auto px-8 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md justify-around"
        >
                <canvas id="canvas" ref={canvasRef} width="860" height="490"></canvas>
                <table>
                    <tbody>
                        <tr>
                        <th>Status:</th>
                        <td id="statusCell">Plotting live data (not recording)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="Controls" className="">
                <div
                    className="mt-2 max-w-4xl mx-auto px-8 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                >
                    <h1 className="mt-4 font-big text-bold underline text-3xl">Controls</h1>
                    <span>Enter the recording duration in seconds, or leave it blank for no timer</span>
                    <div className="flex flex-wrap	">
                        <button
                            id="led1"
                            className="my-2 mr-4 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700"
                            onClick={props.toggleLED}
                        >
                            Toggle LED
                        </button>
                        <button
                            id="startBtn"
                            className="my-2 mr-4 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700"
                            onClick={toggleLiveData}
                        >
                                Stop Plotting Live Data
                        </button>
                        <button
                            id="clearBtn"
                            className="my-2 mr-4 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700"
                        >
                            Clear Data Plot
                        </button>
                        <button
                            id="recordBtn"
                            className="my-2 mr-4 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700"
                        >
                            Record
                        </button>

                        <input type="number" id="recordingDuration" placeholder="Recording Duration (s)" min="0" className="my-2 mr-4 py-2 px-2 rounded border-2"/>

                        <button
                            id="downloadBtn"
                            className="my-2 mr-4 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700 hidden"
                        >
                            Download Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}