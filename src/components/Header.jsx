import { Link, NavLink } from 'react-router-dom'
import Logout from './Logout'

export default function Header(props){

    return (
        <header>
            <nav className="bg-gray-100 p-4 w-full">
                <div className='max-w-7xl mx-auto flex justify-between items-center'>
                    <div>
                        <Link to='/'>SwayPlate</Link>
                    </div>

                    <div className='hidden md:flex space-x-4'>
                        {props.session && (
                            <>
                                <Link to='/record'>Record</Link>
                                <Link to='/dashboard'>Dashboard</Link>
                            </>
                        )}

                    </div>

                    <div className='hidden md:flex space-x-4'>
                        {props.session && (
                            <>
                                <Logout />
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}