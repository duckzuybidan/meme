"use client"
import { ModalContext } from "@/lib/contexts/ModalContext"
import { meme, modalContext } from "@/lib/types"
import { useContext } from "react"
import { AiOutlineEdit , AiOutlineDelete } from "react-icons/ai"
import { useRouter } from "next/navigation"
import { PiTriangleFill } from "react-icons/pi";
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
      className="bg-slate-200 w-full h-72 rounded-lg p-3 cursor-pointer shadow-inner hover:bg-slate-300 max-[400px]:h-60 overflow-hidden pt-8 relative"
      onClick={handleClick}
    >
      {mode === 'editable' &&
      <div className="absolute flex top-1 right-3 gap-2">
        <AiOutlineEdit className="scale-125 cursor-pointer hover:text-green-500" onClick={handleEdit}/>  
        <AiOutlineDelete className="scale-125 cursor-pointer hover:text-red-500" onClick={handleDelete}/>
      </div>
      }
      {meme.type === 'image' && <img src={meme.url} alt={meme.title} className="object-cover object-center rounded-lg h-48 w-full max-[400px]:h-36"/>}
      {meme.type === 'video' && 
        <div className="relative">
          <div className="absolute w-full h-full flex items-center justify-center">
            <PiTriangleFill className="rotate-90 scale-[2] opacity-50"/>
          </div>
          <video src={meme.url} className="object-cover object-center rounded-lg h-48 w-full max-[400px]:h-36"/>
        </div>
      }
      <h3 className="font-semibold text-lg">{meme.title}</h3>
    </li>
  )
}
