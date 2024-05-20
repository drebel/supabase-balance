import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import wbbDemo from '../assets/wbbDemo.png'
import realtimeWbbDemo from '../assets/realtimeWbbDemo.png'
import historicWbbDemo from '../assets/historicWbbDemo.png'

export default function LandingPage(props){

    return(
        <>
            <section className='bg-white py-20'>
                <div className='container mx-auto px-4 text-center'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>High frequency data collection using WBB</h1>
                    {/* <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded' onClick={props.logClick}>Click</button>
                    <button className='bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300' onClick={props.logClick}>Click</button> */}
                    {!props.session && (
                        <div className='max-w-4xl mx-auto'>
                            <Auth className='max-w-4xl' supabaseClient={supabase} appearance={{ theme: ThemeSupa}} providers={[]} />
                        </div>
                    )}
                    <img className='mx-auto' src={wbbDemo} alt="User standing on a Wii Balance Board" />
                </div>
            </section>
            <section className='bg-white py-10'>
                <div className='container mx-auto px-4 text-center'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-4'>Realtime data streaming and recording</h2>
                    <img className='mx-auto ' src={realtimeWbbDemo} alt="" />
                </div>

            </section>
            <section className='bg-white py-10'>

                <div className='container mx-auto px-4 text-center'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-4'>Historic data fetching</h2>
                    <img className='mx-auto max-w-200 max-h-150' src={historicWbbDemo} alt="Screenshot of realtime streaming and recording chart" />
                </div>
            </section>
        </>
    )
}