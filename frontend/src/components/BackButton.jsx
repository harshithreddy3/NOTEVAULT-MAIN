import React from 'react'

const BackButton = ({ back }) => {
    return (
        <div><button className="cursor-pointer duration-200 hover:scale-125 active:scale-100" title="Go Back"
            onClick={back}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" className="stroke-blue-300">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
            </svg>
        </button></div>
    )
}

export default BackButton