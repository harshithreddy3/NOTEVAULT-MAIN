import React from 'react'

function Error({ error }) {
    return (
        <div><p className='text-red-500 text-xs my-2 text-center'>{error}</p></div>
    )
}

export default Error