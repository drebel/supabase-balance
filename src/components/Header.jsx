import { Link, NavLink } from 'react-router-dom'
import Logout from './Logout'

export default function Header(props){

    return (
        <header>
            <nav className="bg-white shadow-md">
                <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                        <Link to='/'>WBB Demo</Link>
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