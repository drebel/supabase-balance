import { Link, NavLink } from 'react-router-dom'

export default function Header(){

    return (
        <header>
            <nav className="bg-gray-100 p-4 w-full">
                <div className='max-w-7xl mx-auto flex justify-between items-center'>
                    <div>
                        <Link to='/'>Measure Balance</Link>
                    </div>

                    <div className='hidden md:flex space-x-4'>
                        <Link to='/login'>Login</Link>
                        <Link to='/signup'>Signup</Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}