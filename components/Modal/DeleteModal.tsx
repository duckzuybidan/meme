import { modal } from "@/lib/types";
import { HiOutlineXMark } from "react-icons/hi2";
import { useState } from 'react'
import { deleteObject, getStorage, ref } from "firebase/storage";
import { app } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteMeme } from "@/lib/redux/memeSlice";

export default function DeleteModal({modal, onClose}: {modal: modal, onClose: () => void}) {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  if(!modal.open){
    return
  }
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const storage = getStorage(app)
      const storageRef = ref(storage, modal.meme?.firebaseName)
      deleteObject(storageRef)
      fetch(`/api/meme/delete/${modal.meme?._id}`, {
        method: 'DELETE',  
      })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setLoading(false)
          toast.error(res.error)
          return
        }
        toast.success(res.message)
        dispatch(deleteMeme(res.data as string))
        setLoading(false)
        onClose()
      })
    }
    catch (error) {
      setLoading(false)
      console.log(error)  
    }
  }
  return (
    <div>
      <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
      <form 
        className='self-center flex flex-col items-center gap-y-6 w-1/2 h-max bg-slate-100 rounded-2xl p-3 max-md:w-5/6 relative overflow-hidden'
        onSubmit={handleSubmit}
      >
        <HiOutlineXMark
          className='absolute top-3 right-3 scale-150 cursor-pointer md:hover:text-red-500 max-md:active:text-red-500'
          onClick={onClose}
        />
        <h1 className='font-semibold text-xl text-red-500 mt-5'>Are you sure to delete this meme?</h1>
        {modal.meme?.type === 'image' && <img src={modal.meme.url} className="object-cover object-center rounded-lg h-48 w-48 max-[400px]:h-36 max-[400px]:w-36"/>}
        {modal.meme?.type === 'video' && <video src={modal.meme.url} className="object-cover object-center rounded-lg h-48 w-48 max-[400px]:h-36 max-[400px]:w-36"/>}
        <h3 className="break-all font-semibold text-lg text-center w-2/3">{modal.meme?.title}</h3>
        <button
            type="submit"
            className="bg-red-500 p-3 rounded-lg w-1/3 font-medium cursor-pointer"
            disabled={loading}
            >
            {loading ? 'Loading...' : 'Delete'}
            </button>
      </form>
    </div>
    </div>
  )
}
