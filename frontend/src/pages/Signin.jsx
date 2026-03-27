import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../utils/fun'
import PwdInput from '../components/PwdInput'
import axios from "axios"
import Error from '../components/Error'
import Spinner from '../components/Spinner'
import Loader from '../components/Loader'

function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [reset, setReset] = useState(false)
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (email === '') {
            setError("Please enter the email");
            return
        } else if (password === '') {
            setError("Please enter the password");
            return
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address ")
            return
        }
        try {
            setLoading(true)
            const response = await axios.post(import.meta.env.VITE_BASE_URL + "/user/signin", {
                email: email,
                password: password,
            });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token)
                navigate("/dashboard");
            }
            else {
                setError(response.data.error)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setError("An unexpected error occured. Please try again")
        }
    }

    const getUser = async () => {
        setPageLoading(true)
        const token = localStorage.getItem("token");
        if (token) {
            const response = await axios.get(import.meta.env.VITE_BASE_URL + "/user/get-user", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.data._id)
                navigate('/dashboard')
        }
        setPageLoading(false)
    }

    const resetOtp = async () => {
        try {
            setLoading(true)
            const resp = await axios.post(import.meta.env.VITE_BASE_URL + '/user/password-reset-otp', { email })

            if (resp.data.error) {
                setError(resp.data.error)
            } else {
                setLoading(false)
                navigate('/reset')
            }
        } catch (error) {
            setError('Internal Server Error')
        }
        setLoading(false)
    }

    useEffect(() => {
        getUser()
    }, [])

    if (pageLoading) return (
        <Loader />
    )

    return (
        <div className={`dark:bg-[#202020] h-screen`}>
            <Navbar />
            <div className={`flex items-center justify-center ${!reset ? 'sm:mt-16' : 'sm:h-screen'} px-4 sm:h-auto h-screen -mt-14`}>
                <div className='w-96 border rounded bg-white px-8 py-8 dark:bg-[#202020] dark:text-white shadow-lg '>
                    {!reset ? <h4 className='text-center text-2xl mb-7'>Login</h4> : null}
                    <input
                        type="text"
                        placeholder='Email'
                        className='input-box'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                    />
                    {!reset ?
                        <><PwdInput value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                            <p className='text-sm text-center mt-4'>
                                Forgot Passowrd?{' '}
                                <button onClick={() => {
                                    setError("")
                                    setReset(true)
                                }
                                } className='font-medium underline text-primary'>
                                    Reset it Here
                                </button>
                            </p></>
                        : null}
                    <Error error={error} />
                    <button onClick={reset ? resetOtp : handleLogin} className={`btn-primary ${loading ? 'bg-blue-300 hover:bg-blue-300' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <Spinner /> :
                            (reset ? 'Send OTP' : 'Login')}
                    </button>
                    {!reset ? <p className='text-sm text-center mt-4'>
                        Not registered yet?{' '}
                        <Link to='/signup' className='font-medium underline text-primary'>
                            Create an account
                        </Link>
                    </p> : null}

                </div>
            </div>
        </div>

    )
}

export default Signin