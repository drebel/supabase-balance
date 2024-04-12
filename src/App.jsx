import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import Instructions from './components/Instructions'
import HeaderLayout from './components/HeaderLayout'
import Header from './components/Header'

import WIIBalanceBoard from '../utils/wiibalanceboard'

export default function App() {

  const [wiibalanceboard, setWiibalanceboard] = useState(undefined)

  async function handleRequest(){
    let device
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x057e }]
      });

      device = devices[0];
      const newWiibalanceboard = new WIIBalanceBoard(device)
      setWiibalanceboard(newWiibalanceboard)
    } catch (error) {
      console.log("An error occurred.", error)
    }

    if (!device) {
      console.log("No device was selected.")
    } else {
      console.log(`HID: ${device.productName}`)

      // enableControls()
      // showLiveData()
    }
  }

  function toggleLED() {
    // LED buttons
    wiibalanceboard.toggleLed(0)
  }



  return (
    <>
      <Router>
        <Routes>
          <Route element={<HeaderLayout />}>
            <Route path='/' element={<LandingPage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/signup' element={<SignupPage />}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}