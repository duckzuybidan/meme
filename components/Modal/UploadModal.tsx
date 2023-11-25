"use client"
import '@/app/globals.css'
import { useState, useEffect, memo } from 'react'
import { HiOutlineXMark } from "react-icons/hi2"
import { FileUploader } from 'react-drag-drop-files-2'
import { FaDeleteLeft } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import { app } from '@/lib/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { useDispatch } from 'react-redux'
import { createMeme, editMeme } from '@/lib/redux/memeSlice'
import {meme, uploadModal} from "@/lib/types"
export default memo(function UploadModal({modal, onClose}: {modal: uploadModal, onClose: () => void}) {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [disabled, setDisableb] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    tags: [] as string[],
    type: '',
    userRef: '',
    firebaseName: ''
  })
  const [loading, setLoading] = useState(false)
  const fileTypes = ["GIF", "JPG", "PNG", "MP4"]
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [tag, setTag] = useState('')
  const [preview, setPreview] = useState('')
  useEffect(() => {
    const handleFileUpload = (file: File) => {
      setFormData(formData => {
      return {
        ...formData,
        type: file.type.split('/')[0]
      }
  })
      setPreview(URL.createObjectURL(file as File))
    }
    if (file) {
      handleFileUpload(file)
      setDisableb(false)
    }
  }, [file])
  useEffect(() => {
    setFormData(formData => {
      return {
      ...formData,
      title: (modal.meme?.title ? modal.meme?.title as string: ''),
      description: (modal.meme?.description ? modal.meme?.description as string : ''),
      tags: (modal.meme?.tags ? modal.meme?.tags : [] as string[])
      }
  })
  }, [modal])
  if(!modal.open){
    return
  }
  
  const handleAddTag = (e : React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(formData.tags.length >= 5){
      toast.error('Each meme only has maximum 5 tags')
      return
    }
    if(tag){
      setFormData({
        ...formData,
        tags: [...formData.tags, tag.replace(/\s/g, '')] 
      })
      setTag('')
    }
  }
  const handleDeleteTag = (i: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag, idx) => idx !== i) 
    })
    
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  const handleSubmit = (e : React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if(modal.mode === 'create'){
        const storage = getStorage(app)
        const fileName = `memes/${new Date().getTime()}`
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file as File)
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.log(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              formData.url = downloadURL
              formData.userRef = currentUser?._id as string
              formData.firebaseName = fileName
              fetch('/api/meme/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
              })
              .then(res => res.json())
              .then(res => {
                if (res.error) {
                  setLoading(false)
                  toast.error(res.error)
                  throw new Error(res.error)
                }
                setLoading(false)
                toast.success(res.message)
                dispatch(createMeme(res.data as meme))
                onClose()
              })
              .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
          }
        )
      }
      if(modal.mode === 'edit'){
        fetch(`/api/meme/edit/${modal.meme?._id}`, {
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
          setLoading(false)
          toast.success(res.message)
          dispatch(editMeme(res.data as meme))
        })
        .then(onClose) 
      }
    } 
    catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
      <form 
        className='self-center flex flex-col justify-items-start items-center gap-y-3 w-4/6 h-max bg-slate-100 rounded-2xl p-3 max-xl:w-5/6 max-xl:mt-7 max-sm:py-6 relative overflow-auto'
        onSubmit={handleSubmit}
      >
        <HiOutlineXMark 
          className='absolute top-3 right-3 scale-150 cursor-pointer hover:text-red-500'
          onClick={onClose}
        />
        <h1 className='font-bold text-3xl text-neutral-800'>{modal.mode === 'create' ? 'CREATE MEME' : 'EDIT MEME'}</h1>
        <div className="flex flex-wrap justify-center items-center gap-4 w-full">
          {modal.mode === 'create' ? ( 
          <>
          <FileUploader
              types={fileTypes}
              label='Upload your meme'
              handleChange={(file: File) => setFile(file as File)}
              maxSize={30}
              onSizeError={() => setError('Only accept the size less than 5MB!')}
              onTypeError={() => setError('Invalid file type!')}
              messages = {{
                  uploaded: file ? file.name : "",
                  upload_another: " ",
                  error: error
              }}   
          />
          
            {formData.type === 'image' && <img src={preview} alt='preview' className="object-cover object-center rounded-lg h-48 w-48"/>}
            {formData.type === 'video' && <video src={preview}  controls controlsList='nodownload' className="object-cover object-center rounded-lg h-48 w-48"/>}
            </>
          ) : (
            <>
            {modal.meme?.type === 'image' && <img src={modal.meme.url} alt={modal.meme.title} className="object-cover object-center rounded-lg h-48 w-48"/>}
            {modal.meme?.type === 'video' && <video src={modal.meme.url}  controls className="object-cover object-center rounded-lg h-48 w-48"/>}
            </>
          )}
          </div>
          <div className="space-y-3 w-2/3">
            <div>
              <label className="font-semibold">Title(required)</label>
              <input
                  type="text"
                  id="title"
                  className="p-3 w-full rounded-lg"
                  value={formData.title}
                  onChange={handleChange}
                  required
              />
            </div>
            <div>
              <label className="font-semibold">Description</label>
              <textarea
                  id="description"
                  className="p-3 w-full rounded-lg resize-none"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 ">
              <label className="font-semibold">Tags</label>
              <input
                  type="text"
                  className="p-3 w-2/3 rounded-lg"
                  maxLength={10}
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
              />
                <button
                  className="bg-blue-400 p-3 rounded-lg w-32 font-medium cursor-pointer"
                  onClick={handleAddTag}
              >
                  Add Tag
                </button>
              </div>
              <ul className="gap-2 flex flex-wrap">
                {formData.tags.map((tag, i) => <li 
                  key={i} 
                  className="p-3 bg-slate-200 rounded-xl flex items-center space-x-2"  
              >
                  <span>#{tag}</span>
                  <FaDeleteLeft onClick={() => handleDeleteTag(i)} className="text-red-500 cursor-pointer"/>
                </li>)}
              </ul>
          </div>
          <button
              type="submit"
              className="bg-green-300 p-3 rounded-lg w-1/3 font-medium cursor-pointer disabled:opacity-75"
              disabled={loading || (modal.mode === 'create' && disabled)}
              >
              {loading ? 'Loading...' : 'Upload'}
          </button>
      </form>
    </div>
  )
})
