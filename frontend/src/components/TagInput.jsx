import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

function TagInput({ tags, setTags, type }) {

    const [inputVal, setInputVal] = useState("")

    const handleInputChange = (e) => {
        setInputVal(e.target.value)
    }

    const addNewTag = () => {
        if (inputVal.trim() !== "") {
            setTags([...tags, inputVal.trim()]);
        }
        setInputVal("")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    return (
        <div>

            <div className="flex items-center gap-2 flex-wrap mt-2 ">
                {tags?.map((tag, index) => (
                    <span key={index} className='flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded dark:bg-black dark:text-white'>#{tag}
                        <button onClick={() => {
                            handleRemoveTag(tag)
                        }}><MdClose className={type === 'view' ? 'hidden' : ''} /></button>
                    </span>
                ))}
            </div>
            <div className='flex items-center gap-4 mt-3 '>
                <input
                    type="text"
                    value={inputVal}
                    className={`text-sm bg-transparent border px-3 py-2 rounded w-[255px] lg:w-full outline-none ${type === 'view' ? 'hidden' : ''}`}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700 ${type === 'view' ? 'hidden' : ''}`}
                    onClick={() => {
                        addNewTag();
                    }}
                >
                    <MdAdd className=' w-full h-full text-2xl text-blue-700 hover:text-white' />
                </button>

            </div>
        </div>
    )
}

export default TagInput