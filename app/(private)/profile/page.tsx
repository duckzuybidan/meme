"use client"
import { useSelector, useDispatch } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import toast from "react-hot-toast"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../../lib/firebase'
import { updateUser } from '@/lib/redux/userSlice'
import { RootState } from '@/lib/redux/store'
import { user } from '@/lib/types'
export default function Page() {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [formData, setFormData] = useState({
    username: currentUser?.username,
    password: currentUser?.password,
    avatar: currentUser?.avatar 
  })
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState('')
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  useEffect(() => {
    const handleFileUpload = (file: File) => {
      if(file.type.split('/')[0] !== 'image'){
        toast.error("Only accept image file!")
        return
      }
      if(file.size > 1024 * 1024){
        toast.error("Only accept the size less than 1MB")
        return
      }
      setImage(URL.createObjectURL(file))
    }
    if (file) {
      handleFileUpload(file)
    }
  }, [file])
  
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      setLoading(true)
      if(!file){
        fetch(`/api/user/update/${currentUser?._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            setLoading(false)
            toast.error(res.error)
            return
          }
          dispatch(updateUser(res.data as user))
          toast.success(res.message)
          setLoading(false)
        })
        return
      }
      const storage = getStorage(app)
      const fileName = `avatar/${currentUser?._id}`
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(async (downloadURL) => {
          formData.avatar = downloadURL
          fetch(`/api/user/update/${currentUser?._id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
          })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              setLoading(false)
              toast.error(res.error)
              return
            }
            dispatch(updateUser(res.data))
            toast.success(res.message)
            setLoading(false)
          })
        })
      })
    }
    catch(error){
      setLoading(false)
      console.log(error)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  return (
    <div className="flex justify-center items-center">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col items-center gap-y-4 w-2/5 h-max p-3 bg-slate-100 rounded-3xl mt-11 max-lg:w-5/6 max-lg:mt-3">
        <div>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setFile((e.target.files as FileList)[0])}}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          />
        <img 
          className="rounded-full h-24 w-24 mt-6 object-cover self-center hover:cursor-pointer" 
          onClick={() => (fileRef.current as any).click()}
          src={image ? image : currentUser?.avatar}
          alt={currentUser?.username}
        />
        </div>
        <div className="space-y-2">
          <label className="mr-3 font-semibold text-xl">Username</label>
          <input 
          type="text"
          className="p-3 w-full rounded-lg text-center"
          id="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
          required
          />
        </div>
        <div className="space-y-2">
          <label className="mr-3 font-semibold text-xl">Email</label>
          <input 
          type="email"
          className="py-3 px-8 w-full rounded-lg text-center focus:outline-none"
          id="email"
          defaultValue={currentUser?.email}
          readOnly
          />
        </div>
        <div className="space-y-2">
          <label className="mr-3 font-semibold text-xl">Password</label>
          <input 
          type="password"
          className="p-3 w-full rounded-lg text-center"
          id="password"
          onChange={handleChange}
          />
        </div>
        <button type='submit' 
          className="bg-green-300 p-3 rounded-lg w-1/3 font-medium  hover:opacity-95" 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      </div>
  )
}
