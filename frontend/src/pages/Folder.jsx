import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import NoteCard from "../components/NoteCard"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmptyCard from '../components/EmptyCard'
import AddBtn from '../components/AddBtn';
import { toast } from 'react-toastify';
import Toast from '../components/Toast';
import 'react-toastify/dist/ReactToastify.css';
import NoData from '../components/NoData';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import Model from '../components/Modal';
import { IoIosClose } from 'react-icons/io';
import TagInput from '../components/TagInput';
import Error from '../components/Error';
import { darkThemeAtom } from '../recoil/atoms/darkThemeAtom';
import { useRecoilValue } from 'recoil';
import Spinner from '../components/Spinner';

const Folder = () => {

    const navigate = useNavigate()
    const [allNotes, setAllNotes] = useState([])
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [noteId, setNoteId] = useState("")
    const darkTheme = useRecoilValue(darkThemeAtom)

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState([])
    const [error, setError] = useState("")
    const [isUpdate, setIsUpdate] = useState(false)
    const [isView, setIsView] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const { id } = useParams()

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        clear()
    }

    const clear = () => {
        setTitle('')
        setContent('')
        setTags([])
        setError('')
        setIsUpdate(false)
        setIsView(false)
    }

    const getSearchNotes = async (search) => {
        setLoading(true)
        const resp = await axios.get(import.meta.env.VITE_BASE_URL + `/note/search/${id}/${search}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        if (resp.data.notes) {
            setNotFound(false)
            if (resp.data.notes.length > 0)
                setAllNotes(resp.data.notes)
            else
                setNotFound(true)
            setLoading(false)
        }
    }

    const clearSearch = () => {
        setNotFound(false)
        getAllNotes()
    }

    const getAllNotes = async () => {
        try {
            const resp = await axios.get(import.meta.env.VITE_BASE_URL + "/note/getNotes/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.notes) {
                setAllNotes(resp.data.notes)
                setLoading(false)
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
            setLoading(false)
        }
    }

    const deleteNote = async (data) => {
        const noteId = data._id
        try {
            const resp = await axios.delete(import.meta.env.VITE_BASE_URL + '/note/' + noteId, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.message) {
                toast.error("Note Deleted Successfully");
                setTimeout(() => {
                    getAllNotes();
                }, 1000);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    }

    const updateIsPinned = async (noteData) => {
        try {
            const noteId = noteData._id
            const resp = await axios.put(import.meta.env.VITE_BASE_URL + '/note/pin/' + noteId, {
                "isPinned": !noteData.isPinned
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.message) {
                toast(!noteData.isPinned ? 'Note Pinned Successfully' : 'Note Unpinned Successfully')
                setTimeout(() => {
                    getAllNotes();
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter the title");
            return
        }
        if (!content) {
            setError("Please enter the content");
            return
        }
        setError("")
        addNewNote()
    }

    const addNewNote = async () => {
        setDisabled(true)
        try {
            const resp = await axios.post(import.meta.env.VITE_BASE_URL + '/note/', {
                title,
                content,
                tags,
                folderId: id
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.message) {
                toast.success('Note added successfully')
                closeModal()
                getAllNotes()
            } else {
                setError(resp.data.error)
                navigate('/dashboard')
            }
        } catch (error) {
            toast.error('Internal Server Error')
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000);
        } finally {
            setDisabled(false)
        }
    }

    const editNote = async () => {
        setDisabled(true)
        try {
            const resp = await axios.put(import.meta.env.VITE_BASE_URL + '/note/' + noteId, {
                title: title,
                content: content,
                tags: tags
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.message) {
                toast.info('Note Edited successfully')
                closeModal()
                getAllNotes()
            } else {
                setError(resp.data.error)
            }
        } catch (error) {
            setError("Internal Server Error")
        } finally {
            setIsUpdate(false)
            setDisabled(false)
        }
    }

    const handleEditNote = () => {
        if (title === "") {
            setError("Title cannot be empty")
            return
        }
        else if (content === "") {
            setError("Content cannot be empty")
            return
        }
        else {
            editNote()
            setError("")
        }
    }


    useEffect(() => {
        setLoading(true)
        getAllNotes()
    }, [])

    return (
        loading
            ? <div className="min-h-screen dark:bg-[#202020]"><Loader /></div>
            : <div className="min-h-screen dark:bg-[#202020]">
                <Toast />
                <Navbar display={true} getSearchNotes={getSearchNotes} clearSearch={clearSearch} />
                {notFound ? <NoData /> :
                    <div className="sm:mr-28 mr-7 sm:pb-10 pb-24 ">
                        {allNotes.length > 0 ?
                            <div className='grid grid-cols-1 gap-2 mt-8 lg:grid-cols-3'>
                                {allNotes.map((item) => (
                                    <NoteCard
                                        key={item._id}
                                        title={item.title}
                                        date={item.createdOn}
                                        content={item.content}
                                        tags={item.tags}
                                        isPinned={item.isPinned}
                                        onEdit={() => {
                                            setTitle(item.title)
                                            setContent(item.content)
                                            setTags(item.tags)
                                            setNoteId(item._id)
                                            setIsUpdate(true)
                                            openModal()
                                        }}
                                        onDelete={() => { deleteNote(item) }}
                                        onPinNode={() => updateIsPinned(item)}
                                        onView={() => {
                                            setTitle(item.title)
                                            setContent(item.content)
                                            setTags(item.tags)
                                            setIsView(true)
                                            openModal()
                                        }}
                                        trash={false}
                                    />
                                ))}
                            </div>
                            : <EmptyCard />}
                    </div>}
                <AddBtn onClick={() => {
                    openModal()
                }} />
                <Model modalIsOpen={modalIsOpen} closeModal={closeModal}>
                    <div className='flex justify-center items-center px-2'>
                        <div className={`border w-full px-4 flex justify-center flex-col`}>
                            <IoIosClose
                                onClick={closeModal}
                                className=' text-5xl cursor-pointer relative mt-3 left-60 sm:left-[21rem]' />
                            <div className='flex flex-col gap-2 '>
                                <label className='input-label'>TITLE</label>
                                <input
                                    type="text"
                                    className={`text-sm text-slate-950 input-box  ${darkTheme && 'text-white'}`}
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                    readOnly={isView}
                                    autoFocus
                                />
                            </div>
                            <div className='flex flex-col gap-2 mt-4'>
                                <label className='input-label'>CONTENT</label>
                                <textarea
                                    type='text'
                                    className={`text-sm text-slate-950 outline-none p-2 rounded input-box ${darkTheme && 'text-white'}`}
                                    rows={7}
                                    onChange={(e) => setContent(e.target.value)}
                                    value={content}
                                    readOnly={isView}
                                />
                            </div>
                            <div className="mt-3">
                                <label className='input-label block mb-1'>TAGS</label>
                                <TagInput tags={tags} setTags={setTags} type={isView ? 'view' : 'add'} />
                            </div>
                            <Error error={error} />
                            <button className={`btn-primary font-medium  my-2
                            ${isView ? 'hidden' : 'block'}
                            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                                disabled={disabled}
                                onClick={() => {
                                    if (isUpdate) {
                                        handleEditNote()
                                    } else {
                                        handleAddNote()
                                    }
                                }}
                            >
                                {disabled ? <Spinner /> : isUpdate ? 'Update' : 'ADD'}
                            </button>
                        </div>
                    </div>
                </Model>
            </div>
    )
}

export default Folder