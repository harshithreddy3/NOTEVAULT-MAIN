import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import searchAtom from '../recoil/atoms/searchAtom'
import { useRecoilState } from 'recoil'

function SearchBar({ getSearchNotes, clearSearch }) {
    const to = localStorage.getItem("token");
    const [search, setSearch] = useRecoilState(searchAtom)
    return (
        <div className={`w-80 flex items-center px-4 bg-slate-100 rounded-md ${to ? '' : 'hidden'} sm:ml-10 dark:bg-black dark:border-2 dark: border-white dark:text-white`}>
            <input
                type="text"
                placeholder='Search notes'
                className='text-xs w-full bg-transparent py-[11px] outline-none'
                onChange={(e) => setSearch(e.target.value)}
                value={search}
            />
            {search.length > 0
                ? <IoMdClose
                    className='cursor-pointer text-slate-400 hover:text-black text-2xl mr-1 dark:text-slate-300 dark:hover:text-white'
                    onClick={() => {
                        setSearch('')
                        clearSearch()
                    }}
                />
                : null}
            <FaMagnifyingGlass
                className='cursor-pointer text-slate-400 hover:text-black dark:text-slate-300 dark:hover:text-white'
                onClick={() => getSearchNotes(search)}
            />

        </div>
    )
}

export default SearchBar