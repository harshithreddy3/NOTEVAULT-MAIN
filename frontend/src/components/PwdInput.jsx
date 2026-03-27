import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

function PwdInput({ value, onChange, placeholder }) {
    const [show, setShow] = useState(false)

    const toggle = () => {
        setShow((show) => !show);
    }
    return (
        <div className='flex items-center bg-transparent border-[1.5px] px-4 rounded mb-3'>
            <input
                value={value}
                onChange={onChange}
                type={show ? "text" : "password"}
                placeholder={placeholder || "Password"}
                className='w-full text-sm bg-transparent py-2 mr-3 rounded outline-none'
                inputMode='text'
            />
            {show ? <FaRegEye
                size={22}
                className='text-primary cursor-pointer'
                onClick={() => toggle()}
            /> : <FaRegEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={() => toggle()}
            />}
        </div>
    )
}

export default PwdInput