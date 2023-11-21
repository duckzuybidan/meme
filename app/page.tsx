"use client"
import { Pagination } from 'flowbite-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { getMeme } from '@/lib/redux/memeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import MemeCard from '@/components/Meme/MemeCard';
import { meme } from '@/lib/types';
import toast from 'react-hot-toast';
export default function Page() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { memeList } = useSelector((state: RootState) => state.meme)
  const memesPerPage = 30
  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      try {
        fetch('/api/meme/getAll', {
          next:{
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
        console.log(error)  
      }
    }
    fetchData()
  }, [dispatch])
  useEffect(() => {
    const getPage = parseInt(searchParams.get('page') as string)
    if(searchParams.get('page')){
      setCurrentPage(getPage)
    }
  }, [searchParams])
  const onPageChange = (page: number) => {
    setCurrentPage(page)
    router.push(`?page=${page}`)
  }
  const idxOfLastMeme = currentPage * memesPerPage
  const idxOfFirstMeme = idxOfLastMeme - memesPerPage
  const currentMemes = memeList.slice(idxOfFirstMeme, idxOfLastMeme)
  return (
    <>
    {loading && <p className='text-center my-7 text-3xl font-bold'>Loading...</p>}
    {!loading && memeList &&
    <div>
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
    </div>
    }
    </>
  )
}
