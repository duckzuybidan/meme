"use client"
import MemeCard from '@/components/Meme/MemeCard'
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getMeme } from "@/lib/redux/memeSlice"
import { RootState } from '@/lib/redux/store'
import { meme } from '@/lib/types'
import toast from 'react-hot-toast'
export default function Page() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { memeList } = useSelector((state: RootState) => state.meme)
  const { currentUser } = useSelector((state: RootState) => state.user)
  useEffect(() => {
    const fetchData = () => {
      setLoading(true)
      try {
        fetch(`/api/meme/getByUserRef/${currentUser?._id}`, {
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
        console.log(error)  
        setLoading(false)
      }
    }
    fetchData()
  }, [currentUser, dispatch])
  return (
    <>
    {loading && <p className='text-center my-7 text-3xl font-bold'>Loading...</p>}
    {!loading && memeList &&
      <>
      {memeList.length === 0 && <p className='text-center my-7 text-3xl font-bold'>You have not created any memes before!</p>}
      <ul className='grid xl:grid-cols-5 gap-6 mt-10 p-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[400px]:gap-3'>
      {memeList.map((meme: meme) => 
        <MemeCard key={meme.firebaseName} meme={meme} mode='editable'/>
      )}
      </ul>
      </>
    }
    </>
  )
}
