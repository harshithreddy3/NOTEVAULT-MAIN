import React, { useState } from 'react'
import { getInitials } from '../utils/fun'
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";
import { BsThreeDotsVertical } from "react-icons/bs";
import Menu from './Menu';
import ThemeSwitch from './ThemeSwitch'

function ProfileInfo({ display }) {
    const userInfo = useRecoilValue(userAtom);
    const token = localStorage.getItem("token");
    const [show, setShow] = useState(false)

    return (
        <>
            <div className={`flex items-center sm:gap-3 gap-1  dark:text-white`}>
                <div className={`w-[50px] h-[50px] lg:w-10 lg:h-10 flex items-center justify-center rounded-full text-slate-950 
                relative left-2 sm:left-0 font-medium bg-blue-100 ${token ? '' : 'hidden'}`}>
                    {getInitials(userInfo?.fullName)}
                </div>
                <div className={`text-center ${token && display ? '' : 'hidden'} `}>
                    <p className='text-sm font-medium sm:block hidden'>{userInfo?.fullName}</p>
                </div>
                <ThemeSwitch />
                {
                    <>
                        <BsThreeDotsVertical
                            className={`cursor-pointer ${token ? '' : 'hidden'}`}
                            onClick={() => { setShow(prev => !prev); }}
                        />
                        <>
                            {show ? <Menu /> : null}
                        </>
                    </>
                }
            </div>
        </>
    )
}

export default ProfileInfo