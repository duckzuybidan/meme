'use client'
import { useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { getMeme } from "@/lib/redux/memeSlice"
import { meme, modalContext } from "@/lib/types"
import MemeCard from "@/components/Meme/MemeCard"
import { Pagination } from "flowbite-react"
import toast from "react-hot-toast"
import { IoFilterOutline } from "react-icons/io5"
import { ModalContext } from "@/lib/contexts/ModalContext"
export default function Result() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { memeList } = useSelector((state: RootState) => state.meme)
  const { setFiltersModal } = useContext(ModalContext) as modalContext
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const router = useRouter()
  const memesPerPage = 30
  useEffect(() => {
    const fetchData = () => {
      setLoading(true) 
      try {
        fetch(`/api/search?${searchParams.toString()}`,{
          next: {
            revalidate: 5
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            setLoading(false)
            toast.error(res.error)
            throw new Error(res.error)
          }
          dispatch(getMeme(res.data as meme[]))
          setLoading(false)
        })
        .catch(error => console.log(error))
      } 
      catch (error) {
        setLoading(false)
        console.log(false)
      }
    }
    fetchData()
  }, [searchParams, dispatch])
  useEffect(() => {
    const getPage = parseInt(searchParams.get('page') as string)
    if(searchParams.get('page')){
      setCurrentPage(getPage)
    }
  }, [searchParams])
  const onPageChange = (page: number) => {
    setCurrentPage(page)
    const urlParams = new URLSearchParams(searchParams.toString())
    urlParams.set('page', page.toString())
    const searchQuery = urlParams.toString()
    router.push(`/result?${searchQuery}`)
  }
  const idxOfLastMeme = currentPage * memesPerPage
  const idxOfFirstMeme = idxOfLastMeme - memesPerPage
  const currentMemes = memeList.slice(idxOfFirstMeme, idxOfLastMeme)
  const handleFilters = () => {
    setFiltersModal({
      open: true
    })
  }
  return (
    <>
    {loading && <p className='text-center my-7 text-3xl font-bold'>Loading...</p>}
    {!loading && memeList &&
    <>
      {memeList.length === 0 && <p className='text-center my-7 text-3xl font-bold'>No result</p>}
      <div className="flex justify-end p-5 ">
        <div 
          className="flex items-center bg-slate-200 gap-3 p-3 rounded-2xl cursor-pointer hover:bg-slate-400"
          onClick={handleFilters}
        >
        <IoFilterOutline className='scale-150'/>
        <p>Filters</p>
        </div>
      </div>
      <ul className='grid xl:grid-cols-5 gap-6 mt-10 p-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[400px]:gap-3'>
        {currentMemes.map((meme: meme) => 
          <MemeCard key={meme.firebaseName} meme={meme} mode='watchOnly'/>
        )}
      </ul>
      {currentPage <= Math.ceil(memeList.length / memesPerPage) && 
        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={Math.ceil(memeList.length / memesPerPage)} onPageChange={onPageChange} 
            previousLabel=""
            nextLabel=""
            showIcons
          />
        </div>
      }
    </>
    }
    </>
  )
}
