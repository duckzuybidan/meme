"use client"
import { ModalContext } from "@/lib/contexts/ModalContext"
import { app } from "@/lib/firebase"
import { createMeme } from "@/lib/redux/memeSlice"
import { RootState } from "@/lib/redux/store"
import { meme, modalContext, quickUploadModal } from "@/lib/types"
import ytdl from "@distube/ytdl-core"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useState, memo, useContext, use } from "react"
import toast from "react-hot-toast"
import { HiOutlineXMark } from "react-icons/hi2"
import { useDispatch, useSelector } from "react-redux"
export default memo(function QuickUploadModal({modal, onClose}: {modal: quickUploadModal, onClose: () => void}) {
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    const [formats, setFormats] = useState<ytdl.videoFormat[] | null>(null)
    const [title, setTitle] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [fileSize, setFileSize] = useState<number[]>([])
    const [disabled, setDisabled] = useState(false)
    const { currentUser } = useSelector((state: RootState) => state.user)
    const {setUploadModal} = useContext(ModalContext) as modalContext
    const dispatch = useDispatch()
    if(!modal.open){
        return
    }
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
          setLoading(true)
          fetch(`/api/meme/quickUpload/getInfo?url=${url}`, {
            next: {
              revalidate: 5
            }
          })
          .then(res => res.json())
          .then(res => {
            if(res.error){
              setLoading(false)
              toast.error(res.error)
              throw new Error(res.error)
            }
            setFormats(res.formats as ytdl.videoFormat[])
            setTitle(res.title)
            setThumbnail(res.thumbnail)
            setFileSize(res.fileSize)
            setLoading(false)
            if(res.formats.length > 0){
              setDisabled(true)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
      catch(error){
        setLoading(false)
        console.log(error)
      }
    }
    const handleFormat = (e: React.SyntheticEvent<HTMLSpanElement>, format: ytdl.videoFormat) => {
      e.preventDefault()
      try{
        setLoading(true)
        fetch('/api/meme/quickUpload', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: url, format: format})
        })
        .then(async (res) => {
          const isJson = res.headers.get('Content-Type')?.includes('application/json')
          if(isJson){
            const json = await res.json()
            if(json.error){
              toast.error(json.error)
              throw new Error(json.error)
            }
          }
          const fileString = await res.text()
          fetch(`data:video/mp4;base64,${fileString}`)
          .then(res => res.blob())
          .then(blob => {
            const storage = getStorage(app)
            const fileName = `memes/${new Date().getTime()}`
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, blob)
            uploadTask.on(
              'state_changed',
              (snapshot) => {},
              (error) => {
                console.log(error)
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                .then(downloadURL => {
                  fetch('/api/meme/create', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      title: title,
                      description: '',
                      url: downloadURL,
                      tags: [] as string[],
                      type: 'video',
                      userRef: currentUser?._id as string,
                      firebaseName: fileName
                    })
                  })
                  .then(res => res.json())
                  .then(res => {
                    if (res.error) {
                      setLoading(false)
                      toast.error(res.error)
                      throw new Error(res.error)
                    }
                    
                    toast.success(res.message)
                    dispatch(createMeme(res.data as meme))
                    onClose()
                    return res.data as meme
                  })
                  .then(meme => {
                    setLoading(false)
                    setDisabled(false)
                    setUrl('')
                    setUploadModal({
                      open: true,
                      meme: meme,
                      mode: 'edit'
                    })
                  })
                  .catch(error => console.log(error))
                })
                .catch(error => console.log(error))
              }
            )
          setLoading(false)
          })
        })
        .catch(error => console.log(error))
      }
      catch(error){
        setLoading(false)
        console.log(error)
      }
    }
    const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(disabled){
        toast.error("Url cannot be changed once got info!\nYou can reload the page if you want paste an another url")
        return
      }
      setUrl(e.target.value)
    }
    return (
    <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
      <form 
        className='self-center flex flex-col justify-items-start items-center gap-y-7 w-1/2 h-max bg-slate-100 rounded-2xl p-3 max-xl:w-5/6 max-xl:mt-7 max-sm:py-6 relative overflow-auto'
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
                onChange={handleUrl}
                required
              />
        </div>
        {title && thumbnail && formats && url && 
        <div className="flex flex-col items-center gap-3 w-2/3 max-sm:w-full">
          {formats.length === 0 && <p className="text-red-500 text-center">No valid format for this video. Please choose another one!</p>}
          {formats.length > 0 && 
          <>
            <img src={thumbnail} alt="thumbnail" className="rounded-lg"></img>  
            <h3 className="font-semibold text-lg">{title}</h3>
            <ul className="flex flex-col gap-2 w-full">
              <li className="flex items-center justify-between sm:mr-7">
                  <p className="font-semibold text-red-500">Quality</p>
                  <p className="font-semibold text-red-500">Size</p>
                  <p className="font-semibold text-red-500">Choose format</p>
              </li>
              {formats.map((format, i) => 
              <li key={format.itag} className="flex items-center justify-between">
                <p>{format.qualityLabel}</p>
                <p className="ml-2">{(fileSize[i] / (1024 * 1024)).toFixed(2)}MB</p>
                <span 
                  className="text-green-500 cursor-pointer max-sm:ml-3" 
                  onClick={(e: React.SyntheticEvent<HTMLSpanElement>) => handleFormat(e, format)}
                >Choose this format</span>
              </li>
              )}
            </ul>
          </>
          }
        </div>
        }
        <button
          type="submit"
          className="bg-green-300 p-3 rounded-lg w-1/3 font-medium cursor-pointer disabled:opacity-75 max-md:w-5/6"
          disabled={loading || disabled}
          >
          {loading ? 'Loading...' : 'Get info'}
        </button>
        <button
          className="bg-red-500 p-3 rounded-lg w-1/3 font-medium cursor-pointer disabled:opacity-75 max-md:w-5/6"
          onClick={() => {
            setUrl('')
            setDisabled(false)
          }}
          disabled={!url}
        >
          Clear Url
        </button>
      </form>
    </div>
  )
})
