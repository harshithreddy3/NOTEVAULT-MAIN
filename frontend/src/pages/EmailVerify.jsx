import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import Error from '../components/Error'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import OTP_Input from '../components/OTP_Input'

const EmailVerify = () => {

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const inputRefs = React.useRef([])


    const onSubmit = async () => {
        const otp = inputRefs.current.map(ref => ref.value).join('')
        if (otp.length < 6) {
            setError("Enter complete otp to verify")
            return;
        }
        setError("")
        try {
            const resp = await axios.post(import.meta.env.VITE_BASE_URL + "/user/verify-otp", {
                otp: otp
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            if (resp.data.error) {
                setError(resp.data.error)
                return;
            } else {
                setError("")
                navigate('/dashboard')
            }

        } catch (error) {
            setError("Internal server error")
        }
    }

    const isVerified = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            navigate('/signup')
        }
        try {
            if (token) {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + "/user/get-user", {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                if (response.data.isAccountVerified)
                    navigate('/dashboard')
            }
            else
                navigate('/signup')
            setLoading(false)
        } catch (error) {
            setError("Internal Server Error")
        }
        setLoading(false)
    }

    useEffect(() => {
        isVerified()
    }, [])


    return (
        loading ? <div className={` dark:bg-gray-900`}><Loader /></div> :
            <>
                <Navbar display={false} />
                <div className='flex items-center sm:h-[90vh] justify-center dark:bg-[#202020] h-screen px-4 -mt-14 sm:mt-0'>
                    <div className='w-96 border border-slate-200 rounded bg-white px-8 py-8 dark:bg-[#202020] dark:text-white shadow-lg'>
                        <h4 className='text-center text-2xl mb-3'>Email Verify OTP</h4>
                        <p className='text-slate-400 dark:text-slate-500 text-center mb-3'>Enter the 6-digit code sent to your email id.</p>
                        <OTP_Input inputRefs={inputRefs} />
                        <Error error={error} />
                        <button className='btn-primary' onClick={onSubmit}>
                            Verify Email
                        </button>
                    </div>
                </div>
            </>
    )
}

export default EmailVerify