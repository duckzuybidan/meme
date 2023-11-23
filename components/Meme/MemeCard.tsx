"use client"
import { ModalContext } from "@/lib/contexts/ModalContext"
import { meme, modalContext } from "@/lib/types"
import { useContext } from "react"
import { AiOutlineEdit , AiOutlineDelete, AiFillLike } from "react-icons/ai"
import { useRouter } from "next/navigation"
import { PiTriangleFill } from "react-icons/pi";
import { MdDownload } from "react-icons/md"
export default function MemeCard({meme, mode} : {meme: meme, mode: 'editable' | 'watchOnly'}) {
  const {setDeleteModal, setUploadModal} = useContext(ModalContext) as modalContext
  const router = useRouter()
  const handleDelete = (e: React.SyntheticEvent<SVGAElement>) => {
    e.stopPropagation()
    setDeleteModal({
      open: true,
      meme: meme
    })
  }
  const handleEdit = (e: React.SyntheticEvent<SVGAElement>) => {
    e.stopPropagation()
    setUploadModal({
      open: true,
      meme: meme,
      mode: 'edit'
    })
  }
  const handleClick = () => {
    router.push(`/meme/${meme._id}`)
  }
    return (
    <li 
      className="bg-slate-200 w-full h-80 rounded-lg p-3 cursor-pointer shadow-inner hover:bg-slate-300 max-[400px]:h-60 overflow-hidden pt-8 relative"
      onClick={handleClick}
    >
      {mode === 'editable' &&
      <div className="absolute flex top-1 right-3 gap-2">
        <AiOutlineEdit className="scale-125 cursor-pointer hover:text-green-500" onClick={handleEdit}/>  
        <AiOutlineDelete className="scale-125 cursor-pointer hover:text-red-500" onClick={handleDelete}/>
      </div>
      }
      <div className="absolute top-0 left-3 flex gap-3 items-end">
        <div className="flex items-center">
          <p className="text-red-500 font-semibold">{meme.downloads}</p>
          <MdDownload className='mt-0.5 text-red-500'/>
        </div>
        <div className="flex items-center">
          <p className="text-blue-500 font-semibold">{meme.likes.length}</p>
          <AiFillLike className='text-blue-500'/>
        </div>
      </div>
      {meme.type === 'image' && <img src={meme.url} alt={meme.title} className="object-cover object-center rounded-lg h-48 w-full max-[400px]:h-36"/>}
      {meme.type === 'video' && 
        <div className="relative">
          <div className="absolute w-full h-full flex items-center justify-center">
            <PiTriangleFill className="rotate-90 scale-[2] opacity-50"/>
          </div>
          <video src={meme.url} className="object-cover object-center rounded-lg h-48 w-full max-[400px]:h-36"/>
        </div>
      }
      <h3 className="font-semibold text-lg break-all max-[400px]:text-md">{meme.title.length <= 30 ? meme.title : meme.title.substring(0, 31) + '...'}</h3>
    </li>
  )
}
