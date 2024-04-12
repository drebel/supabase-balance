import React from 'react'

export default function Instructions(props){

    return(
        <div
        id="instructions"
        className="max-w-4xl mx-auto px-8 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
            <h1 className="my-4 font-big text-bold  text-3xl">Step 1 - Enable bluetooth API on your browser</h1>
            <ol className="my-2">
                <li>Open this site in a Chrome or Edge browser</li>
                <li>If you are using Edge skip to Step 2. If you are using Chrome continue with Step 1</li>
                <li>Enter <code>chrome://flags</code> into your URL bar</li>
                <li>Search for <code>#enable-experimental-web-platform-features</code></li>
                <li>Enable <code>Experimental Web Platform features</code></li>
                
            </ol>

            <h1 className="my-4 font-big text-bold text-3xl">Step 2 - Connect your Wii Balance Board to your computer</h1>
            <ol className="my-2">
                <li>Open a new finder window and go to <code>Control Panel\Hardware and Sound\Devices and Printers</code><br/>
                I usually get here by going to add a bluetooth device, scrolling down and then clicking <code>Devices and Printers</code><br/>
                Pairing the board the normal way you connect bluetooth devices will not work</li>
                <li>In the Devices and Printers window, Click <code>Add a Device</code> </li>
                <li>On your Wii Balance board, push the red button inside the battery pannel</li>
                <li>The board my appear as unnamed input device or named something like Nintendo RVL-WBC-01</li>
                <li>You will be asked for a pin. Just click Next without entering anything. Do not click into the input box otherwise you will not be able to click Next.</li>
            </ol>

            <h1 className="my-4 font-big text-bold text-3xl">Step 3 - Connect your Wii Balance Board to your browser</h1>
            <ol className="my-2">
                <li>Click button bellow and select your Wii Balance Board</li>
            </ol>
          
            <div className="flex justify-center items-center">
                <button
                id="request-hid-device"
                className="my-2 py-2 px-4 capitalize bg-blue-600 dark:bg-gray-800 text-white rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700 flex"
                onClick={props.handleFindBoard}
                >
                Connect Wii Balance Board
                </button>
            </div>
        </div>
    )

}