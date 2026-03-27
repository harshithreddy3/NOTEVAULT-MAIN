import React from 'react'
import noData from "../assets/no-data.svg"
import noDataDark from "../assets/no-data-dark.svg"
import { useRecoilValue } from "recoil";
import { darkThemeAtom } from '../recoil/atoms/darkThemeAtom';

function NoData() {
    const theme = useRecoilValue(darkThemeAtom)
    return (
        <div className='flex flex-col items-center justify-center'>
            <img src={`${theme ? noDataDark : noData}`} alt="no notes" className='w-60 relative top-20' />
            <p className='w-1/2 text-md font-medium text-slate-700 text-center leading-10 mt-24 dark:text-white'>Oops! No notes found matching your search.</p>
        </div>
    )
}
export default NoData