import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function LandingPage(props){
    return(
        <section>
            <h1>Demo for high frequency data collection using WBB</h1>
            {!props.session && <Auth supabaseClient={supabase} />}
        </section>
    )
}