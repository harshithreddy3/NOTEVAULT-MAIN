import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Toast from '../components/Toast';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import NoteCard from '../components/NoteCard';
import Navbar from '../components/Navbar';

const Trash = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false)

    const getTrashNotes = async () => {
        try {
            const resp = await axios.get(import.meta.env.VITE_BASE_URL + '/note/trash', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            if (resp.data.error) {
                toast.error(resp.data.error)
            } else
                setNotes(resp.data)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Internal server error")
        }
    }

    const onRestore = async (id) => {
        try {
            const resp = await axios.put(import.meta.env.VITE_BASE_URL + `/note/restore/${id}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            if (resp.data.error) {
                toast.error(resp.data.error)
            } else {
                toast.success("Note restored successfully")
                getTrashNotes()
            }
        }
        catch (error) {
            console.log(error);
            toast.error("Internal server error")
        }
    }

    const onPermanentDelete = async (id) => {
        try {
            const resp = await axios.delete(import.meta.env.VITE_BASE_URL + `/note/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            );
            if (resp.data.error) {
                toast.error(resp.data.error)
            } else {
                toast.success("Note deleted Permanently")
                getTrashNotes()
            }
        }
        catch (error) {
            console.log(error);
            toast.error("Internal server error")
        }
    }

    useEffect(() => {
        setLoading(true);
        getTrashNotes()
    }, [])

    if (loading)
        return <Loader />

    return (
        <div className='dark:bg-[#202020] h-screen'>
            <Navbar />
            <Toast />
            {
                notes.length === 0 && <div className='flex h-96 items-center justify-center sm:mt-4 mt-10'>
                    <p className='text-5xl font-medium text-slate-700 text-center leading-8 mt-5 dark:text-white'>
                        Trash is Empty!
                    </p>
                </div>
            }
            <div className='grid grid-cols-1 gap-2 mt-8 lg:grid-cols-4'>
                {notes.map((note) => (
                    <NoteCard
                        key={note._id}
                        title={note.title}
                        date={note.createdAt}
                        content={note.content}
                        tags={note.tags}
                        isPinned={note.isPinned}
                        trash={true}
                        onRestore={() => onRestore(note._id)}
                        onPermanentDelete={() => onPermanentDelete(note._id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Trash