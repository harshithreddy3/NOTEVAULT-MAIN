import React, { useState } from 'react'
import Navbar from "../components/Navbar"
import Error from '../components/Error'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import OTP_Input from '../components/OTP_Input'
import PwdInput from "../components/PwdInput"
import { toast } from 'react-toastify';
import Toast from '../components/Toast'

const PasswordReset = () => {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const inputRefs = React.useRef([])
    const [pwd, setPwd] = useState("")
    const [email, setEmail] = useState("")

    const onSubmit = async () => {
        const otp = inputRefs.current.map(ref => ref.value).join('')
        try {
            // setLoading(true)
            const resp = await axios.post(import.meta.env.VITE_BASE_URL + "/user/set-new-password", {
                email: email,
                password: pwd,
                otp: otp
            });
            if (resp.data.error) {
                setError(resp.data.error)
                return;
            } else {
                toast.success(resp.data.message);
                setTimeout(() => {
                    navigate('/signin')
                }, 2000);
            }

        } catch (error) {
            setError("Internal Server error")
        }
        setLoading(false)
    }

    return (
        loading ? <div className={` dark:bg-[#202020]`}><Loader /></div> :
            <>
                <Toast />
                <Navbar display={false} />
                <div className='flex items-center sm:h-[90vh] justify-center dark:bg-[#202020] h-screen px-4 -mt-14 sm:mt-0'>
                    <div className='w-96 border border-slate-200 rounded bg-white px-8 py-8 dark:bg-[#202020] dark:text-white shadow-lg'>
                        <h4 className='text-center text-2xl mb-3'>Password Reset</h4>
                        <input type="email" className='input-box' onChange={e => { setEmail(e.target.value) }}
                            placeholder='Enter your email' required autoFocus />
                        <PwdInput value={pwd}
                            onChange={(e) => { setPwd(e.target.value) }}
                            placeholder={"New Password"}
                        />
                        <p className='text-slate-400 dark:text-slate-500 text-center mb-3'>Enter the 6-digit code sent to your email id.</p>
                        <OTP_Input inputRefs={inputRefs} />
                        <Error error={error} />
                        <button className='btn-primary' onClick={onSubmit}>
                            Change Password
                        </button>
                    </div>
                </div>
            </>
    )
}

export default PasswordReset