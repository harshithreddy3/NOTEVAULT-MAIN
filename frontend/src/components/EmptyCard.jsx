import React from 'react'
import addNoteImage from '../assets/add-note.svg';
import addNoteDark from '../assets/add-note-dark.svg';
import { useRecoilValue } from "recoil";
import { darkThemeAtom } from '../recoil/atoms/darkThemeAtom';


function EmptyCard() {
    const theme = useRecoilValue(darkThemeAtom)
    return (
        <div className='flex flex-col items-center justify-center sm:mt-4 mt-10 sm:ml-28 ml-8'>
            <img src={`${theme ? addNoteDark : addNoteImage}`} alt="no notes" className='sm:w-60 w-48' />
            <p className='sm:w-1/2 w-80 text-md font-medium text-slate-700 text-center leading-8 mt-5 dark:text-white'>Start creating your first note! by clicking on '+' icon,to jot down your thoughts, ideas, and remainders. Let's get started!</p>
        </div>
    )
}

export default EmptyCard