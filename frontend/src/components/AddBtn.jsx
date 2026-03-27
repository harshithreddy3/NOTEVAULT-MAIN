import React from 'react'
import { MdAdd } from 'react-icons/md'
function AddBtn({ onClick }) {
    return (
        <button className='w-12 h-12 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-6 bottom-8 ' onClick={onClick}>
            <MdAdd className='text-[32px] text-white ' />
        </button>
    )
}

export default AddBtn