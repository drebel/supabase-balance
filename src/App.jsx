import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'

import LandingPage from './pages/LandingPage'
import RecordPage from './pages/RecordPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import HeaderLayout from './components/HeaderLayout'

import WIIBalanceBoard from '../utils/wiibalanceboard'

export default function App() {

  const [wiibalanceboard, setWiibalanceboard] = useState(undefined)

  async function handleFindBoard(){
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



  return (
    <>
      <Router>
        <Routes>
          <Route element={<HeaderLayout />}>
            <Route path='/' element={<LandingPage />}/>
            <Route path='/record' element={<RecordPage 
              handleFindBoard={handleFindBoard}
              wiibalanceboard={wiibalanceboard}
            />}/>
            <Route path='/dashboard' element={<DashboardPage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/signup' element={<SignupPage />}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}