import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function LandingPage(props){
    return(
        <section className='bg-white py-20'>
            <div className='container mx-auto px-4 text-center'>
                <h1 className='text-4xl font-bold text-gray-900 mb-4'>High frequency data collection using WBB</h1>
                {/* <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded' onClick={props.logClick}>Click</button>
                <button className='bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300' onClick={props.logClick}>Click</button> */}
                {!props.session && <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa}} providers={[]} />}
            </div>
        </section>
    )
}