import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Error from '../components/Error'
import PwdInput from "../components/PwdInput"
import BackButton from "../components/BackButton"
import Navbar from '../components/Navbar'

function Delete() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [password, setPassword] = useState("");

    const deleteAcc = async () => {
        if (password === "") {
            setError("Please Enter Password");
            return
        }
        try {
            const resp = await axios.delete(import.meta.env.VITE_BASE_URL + '/user/', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                },
                data: {
                    password: password
                }
            });
            if (resp.data.error) {
                setError(resp.data.error)
            } else {
                localStorage.clear()
                navigate('/signin');
            }
        } catch (error) {

        }

    }

    const back = () => {
        navigate('/dashboard')
    }

    return (
        <>
            <Navbar display={false} />
            <div className='flex items-center justify-center sm:h-[90vh] h-[94vh] dark:bg-black dark:text-white'>
                <div className="border px-4 py-8 space-y-3 sm:w-96 w-80 bg-white shadow-lg rounded-lg dark:bg-[#000000]">
                    <div className='flex sm:gap-16 gap-6'>
                        <BackButton back={back} />
                        <h1 className='text-center text-2xl mt-1 mb-7 font-bold'>
                            Delete Account
                        </h1>
                    </div>
                    <div className="flex flex-col">
                        <h4 className='text-center text-sm text-gray-400'>To Delete your account enter the password</h4>
                    </div>
                    <div className="p-4">
                        <PwdInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Error error={error} />
                        <button onClick={deleteAcc} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 py-2 w-full bg-red-500 text-white mt-4">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Delete