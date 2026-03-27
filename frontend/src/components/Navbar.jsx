import React from 'react'
import ProfileInfo from './ProfileInfo'
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

function Navbar({ getSearchNotes, clearSearch, display }) {
    return (
        <div className='bg-white flex items-center justify-between px-4 py-1 drop-shadow dark:bg-black sticky w-full top-0 z-10'>
            <Link to={'/'}>
                <h2 className={`text-xl py-2 font-medium text-black sm:inline dark:text-white ${display ? 'sm:inline hidden' : 'inline'}`}>Note-Vault</h2>
            </Link>
            {display ? <>
                <SearchBar getSearchNotes={getSearchNotes} clearSearch={clearSearch} />
            </>
                : null}
            <ProfileInfo display={display} />

        </div>
    )
}

export default Navbar
