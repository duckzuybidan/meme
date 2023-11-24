"use client"
import { quickUploadModal } from "@/lib/types"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { HiOutlineXMark } from "react-icons/hi2"
export default function QuickUploadModal({modal, onClose}: {modal: quickUploadModal, onClose: () => void}) {
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    if(!modal.open){
        return
    }
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
        fetch('/api/meme/quickUpload', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: url})
        })
        .then(res => res.json())
        .then(res => {
          if(res.error){
            toast.error(res.error)
            throw new Error(res.error)
          }
          console.log(res)

        })
        .catch(error => console.log(error))
      }
      catch(error){
        console.log(error)
      }
    }
    return (
    <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
      <form 
        className='self-center flex flex-col justify-items-start items-center gap-y-7 w-1/2 h-max bg-slate-100 rounded-2xl p-3 max-xl:w-5/6 max-xl:mt-7 max-sm:py-6 relative'
        onSubmit={handleSubmit}
      >
        <HiOutlineXMark 
          className='absolute top-3 right-3 scale-150 cursor-pointer hover:text-red-500'
          onClick={onClose}
        />
        
        <h1 className='font-bold text-3xl text-neutral-800'>QUICK UPLOAD</h1>
        <div className="flex items-center w-2/3 gap-2 max-sm:flex-col max-sm:w-full">
              <label className="font-semibold w-32 text-red-500">Youtube URL</label>
              <input
                    type="url"
                    placeholder="Paste your youtube url..."
                    className="p-3 w-full rounded-lg"
                    value={url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                    required
              />
        </div>
        <button
              type="submit"
              className="bg-green-300 p-3 rounded-lg w-1/3 font-medium cursor-pointer disabled:opacity-75"
              disabled={loading}
              >
              {loading ? 'Loading...' : 'Upload'}
          </button>
      </form>
    </div>
  )
}
