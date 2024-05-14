import {Outlet} from 'react-router-dom'

import Header from './Header'

export default function HeaderLayout(props){

    return (
        <>
            <Header session={props.session}/>
            <Outlet />
        </>
    )
}