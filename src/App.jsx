import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import supabase from '../utils/supabase'

import './App.css'

import LandingPage from './pages/LandingPage'
import RecordPage from './pages/RecordPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import HeaderLayout from './components/HeaderLayout'

import WIIBalanceBoard from '../utils/wiibalanceboard'


export default function App() {

  const [session, setSession] = useState(null)
  const [wiibalanceboard, setWiibalanceboard] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }}) => {
      setSession(session)
    })

    const {
      data: { subscription }, 
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])







  async function handleFindBoard(){
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x057e }]
      });

      const device = devices[0];
      const newWiibalanceboard = new WIIBalanceBoard(device)
      setWiibalanceboard(newWiibalanceboard)

      console.log(`HID: ${device.productName}`)
    } catch (error) {
      console.log("An error occurred.", error)
    }
  }



  return (
    <>
      <Router>
        <Routes>
          <Route element={<HeaderLayout 
            session={session}
          />}>
            <Route path='/' element={<LandingPage 
              session={session}
            />}/>
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