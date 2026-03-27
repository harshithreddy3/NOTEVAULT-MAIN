import React from 'react'
import { MdCreate, MdDelete, MdOutlineOpenInFull, MdOutlinePushPin, MdOutlineRestore } from 'react-icons/md'
import moment from "moment"

function NoteCard({
    title,
    date,
    content,
    tags = [],
    isPinned,
    onEdit,
    onDelete,
    onPinNode,
    onView,
    trash,
    onRestore,
    onPermanentDelete
}) {
    return (
        <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out ml-7 dark:bg-[#323030] dark:text-white relative'>
            <div className="flex items-center justify-between ">
                <div>
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className="text-xs dark:text-white text-slate-500">{moment(date).format('Do MMM YYYY')}</span>
                </div>
                {
                    !trash ?
                        <MdOutlinePushPin
                            className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300 '}`}
                            onClick={onPinNode}
                        /> : null
                }
            </div>
            <p className='text-xs text-slate-600 mt-2 dark:text-white'>{content?.slice(0, 20)}</p>
            <div className='flex  items-center justify-between mt-2'>
                <div className="text-xs text-slate-500 dark:text-white">{tags.map((tag) => (
                    `#${tag} `
                ))}</div>
                <div className="flex items-center gap-2 mt-2 pb-2">
                    {
                        !trash ?
                            <>
                                <MdOutlineOpenInFull
                                    className='icon-btn hover:text-blue-500'
                                    onClick={onView}
                                />
                                <MdCreate
                                    className='icon-btn hover:text-green-600'
                                    onClick={onEdit}
                                />
                            </>
                            :
                            <MdOutlineRestore
                                className='icon-btn hover:text-blue-500'
                                onClick={onRestore}
                            />
                    }
                    <MdDelete
                        className='icon-btn hover:text-red-500'
                        onClick={() => {
                            if (trash) {
                                onPermanentDelete()
                            } else {
                                onDelete()
                            }
                        }}
                    />
                </div>

            </div>
        </div>
    )
}

export default NoteCard
