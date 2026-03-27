import React from 'react'

function Empty() {

    return (
        <div className='flex h-96 items-center justify-center sm:mt-4 mt-10'>
            <p className='sm:w-1/2 w-60 text-lg font-medium text-slate-700 text-center leading-8 mt-5 dark:text-white'>
                No folders present, create a folder by clicking on '+' icon, to organize your notes. Let's get started!
            </p>
        </div>
    )
}

export default Empty