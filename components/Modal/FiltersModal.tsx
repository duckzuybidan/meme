"use client"
import { useEffect, useState } from "react"
import { filtersModal } from "@/lib/types"
import { Checkbox, Label, Select } from "flowbite-react"
import { HiOutlineXMark } from "react-icons/hi2"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

export default function FiltersModal({modal, onClose}: {modal: filtersModal, onClose: () => void}) {
    const [formData, setFormData] = useState({
        sortBy: '',
        getVideo: true,
        getImage: true,
    })
    const searchParams = useSearchParams()
    const router = useRouter()
    useEffect(() => {
        if(modal.open){
            setFormData({
                sortBy: searchParams.get('sortBy') ? searchParams.get('sortBy') as string : '',
                getVideo: searchParams.get('getVideo') === 'false' ? false : true,
                getImage: searchParams.get('getImage') === 'false' ? false : true
            })
        }
        
    }, [searchParams, modal.open])
    if(!modal.open){
        return
    }
   
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(formData.getVideo === false && formData.getImage === false){
            toast.error("You must choose at least one type of meme in type section!")
            return
        }
        const urlParams = new URLSearchParams(searchParams.toString())
        urlParams.set('sortBy', formData.sortBy)
        urlParams.set('getVideo', formData.getVideo.toString())
        urlParams.set('getImage', formData.getImage.toString())
        const searchQuery = urlParams.toString()
        router.push(`/result?${searchQuery}`)
        onClose()
    }
    return (
        <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
            <form 
                className='self-center flex flex-col justify-items-start gap-y-5 w-1/2 h-max bg-slate-100 rounded-2xl p-3 max-xl:w-5/6 max-xl:mt-7 max-sm:py-6 relative'
                onSubmit={handleSubmit}
            >
                <HiOutlineXMark 
                    className='absolute top-3 right-3 scale-150 cursor-pointer hover:text-red-500'
                    onClick={onClose}
                />
                <div className="w-1/2 flex flex-col gap-2 max-md:w-5/6">
                    <Label value="Sort by" />
                    <Select 
                        value={formData.sortBy} 
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, sortBy: e.target.value})}
                    >
                        <option value=''>-- Choose an option</option>
                        <option value='topLike'>Top Like</option>
                        <option value='topDownload'>Top Download</option>
                    </Select>
                    <div className="flex gap-5 sm:items-center max-sm:flex-col">
                        <Label value="Type:"/>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                checked={formData.getVideo} 
                                onChange={() => setFormData({...formData, getVideo: !formData.getVideo})}
                            />
                            <p>Video</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                checked={formData.getImage} 
                                onChange={() => setFormData({...formData, getImage: !formData.getImage})}
                            />
                            <p>Image</p>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="self-center bg-green-300 p-2 rounded-lg w-1/4 font-medium cursor-pointer disabled:opacity-75 max-md:w-1/3"
              >
                    Apply
                </button>
            </form>
        </div>
    )
}
