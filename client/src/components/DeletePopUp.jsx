import React from 'react'

const DeletePopUp = ({onCancel, onDelete}) => {
  return (
   <>
    <div   className='w-fit px-5 py-2 flex flex-col gap-2 bg-slate-700/30 backdrop-filter backdrop-blur-lg shadow-xl text-white rounded-lg absolute -right-28 z-10'>
        <div className='flex gap-5'>
        <button onClick={onCancel} className=''><img src="/pngegg (1).png" alt="cancel" className='w-5' title='cancel'/></button>
        <button onClick={onDelete} className=''><img src="/pngegg.png" alt="" className='w-5' title='delete' /></button>
        </div>
    </div>
    
   </>
  )
}

export default DeletePopUp