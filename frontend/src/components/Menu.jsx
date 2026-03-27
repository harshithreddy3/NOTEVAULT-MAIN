import React from 'react'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
    const onLogout = () => {
        if (token) {
            localStorage.removeItem("token")
            localStorage.removeItem("userInfo")
            navigate("/signin")
        }
    }

    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    return (
        <div className='absolute top-14 right-6 border px-6 py-2 bg-white shadow-lg rounded-sm sm:mt-0 flex flex-col dark:bg-black'>
            <button onClick={() => { navigate('/trash') }}
                className={`p-2 ${token ? '' : 'hidden'} border-gray-400 border-b-2 hover:bg-slate-100 dark:hover:bg-slate-700`}>
                Trash
            </button>
            <button
                className={`p-2 ${token ? '' : 'hidden'} border-gray-400 border-b-2 hover:bg-slate-100 dark:hover:bg-slate-700`} onClick={onLogout}>
                Logout
            </button>
            <button onClick={() => { navigate('/delete') }}
                className={`p-2 ${token ? '' : 'hidden'} border-gray-400 border-b-2 hover:bg-slate-100 dark:hover:bg-slate-700`}>
                Delete Account
            </button>
        </div>
    )
}

export default Menu