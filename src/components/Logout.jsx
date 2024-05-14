import React from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../utils/supabase'

export default function LogOut() {
    const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <a onClick={handleSignOut}>
      Logout
    </a>
  )
}