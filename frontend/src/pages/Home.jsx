import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom"
import AddBtn from '../components/AddBtn';
import { toast } from 'react-toastify';
import Toast from '../components/Toast';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
import Model from '../components/Modal';
import Error from '../components/Error';
import { FolderIcon } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { darkThemeAtom } from '../recoil/atoms/darkThemeAtom';
import Empty from '../components/NoFolder';

function Home() {

    const navigate = useNavigate()
    const [_, setUserInfo] = useRecoilState(userAtom);
    const [loading, setLoading] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [folder, setFolder] = useState('');
    const [error, setError] = useState('')
    const [folders, setFolders] = useState([])
    const darkTheme = useRecoilValue(darkThemeAtom)

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const getUser = async () => {
        setLoading(true)
        const token = localStorage.getItem("token");
        if (token) {
            const response = await axios.get(import.meta.env.VITE_BASE_URL + "/user/get-user", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (!response.data._id) {
                navigate('/signin')
            }
            else if (!response.data.isAccountVerified) {
                navigate('/email-verify')
            }
            else {
                setUserInfo(response.data)
            }
            setLoading(false)
        } else {
            navigate('/signin')
        }
    }

    const addFolder = async () => {
        if (!folder) {
            setError('Please enter folder name')
            return
        } else if (folder.length > 20) {
            setError('Folder name should be less than 20 characters')
            return
        }
        setError('')
        try {
            const resp = await axios.post(import.meta.env.VITE_BASE_URL + "/folder/create", {
                name: folder
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.message) {
                toast.success('Folder created successfully')
                closeModal()
                setFolder('')
                getFolders()
            }
        }
        catch (error) {
            console.log(error);
            setError('An unexpected error occurred. Please try again.')
        }
    }

    const getFolders = async () => {
        try {
            const resp = await axios.get(import.meta.env.VITE_BASE_URL + "/folder/", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            setFolders(resp.data)
        } catch (error) {
            console.log(error);
        }
    }

    const removeFolder = async (id) => {
        try {
            const resp = await axios.delete(import.meta.env.VITE_BASE_URL + '/folder/' + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })

            if (resp.data.error) {
                toast.error(resp.data.error);
            } else {
                toast.success(resp.data.message)
                getFolders()
            }
        } catch (error) {
            console.log(error);
            toast.error('Internal Server Error')
        }
    }

    useEffect(() => {
        getUser()
        getFolders()
    }, [])


    return (
        loading
            ? <div className={`dark:bg-[#202020]`}><Loader /></div>
            : <div className={` dark:bg-[#202020] min-h-screen`}>
                <Toast />
                <Navbar display={false} />
                <div >
                    {folders.length === 0 ? <Empty />
                        :
                        <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-4 mx-6 sm:mr-24 sm:pb-28 pb-24">
                            {folders.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-md  dark:bg-[#4b4a4a] dark:text-white cursor-pointer hover:shadow-lg transition duration-300 ease-in-out relative
                            ">
                                    <Trash2 className='absolute right-5 hover:text-red-500'
                                        onClick={() => {
                                            removeFolder(item._id);
                                        }}
                                    />
                                    <div className="flex flex-col items-center"
                                        onClick={() => {
                                            navigate(`/folder/${item._id}`)
                                        }}>
                                        <FolderIcon size={80}

                                        />
                                        <p className='text-slate-400 text-sm'>
                                            Notes Present : {item.noteCount}</p>
                                        <h1 className="text-lg font-semibold">{item.name}</h1>
                                        <h2 className='text-xs text-slate-400'>{item.createdOn.slice(0, 10).split("-").reverse().join("-")}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
                <AddBtn onClick={() => {
                    openModal()
                }} />

                <Model modalIsOpen={modalIsOpen} closeModal={closeModal}>
                    <div>
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Enter Folder Name
                        </h2>
                        <input type="text"
                            className={`w-full p-2 border border-gray-300 rounded-md mb-4 text-black ${darkTheme && 'bg-[#202020] text-white'}`}
                            value={folder}
                            onChange={(e) => setFolder(e.target.value)}
                            autoFocus
                        />
                        <Error error={error} />
                        <div className="flex justify-between mt-5">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'cursor-not-allowed' : ''}`}
                                onClick={addFolder}
                                disabled={loading}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </Model>
            </div>
    )
}

export default Home