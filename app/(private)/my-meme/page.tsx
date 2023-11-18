"use client"
import MemeCard from '@/components/Meme/MemeCard'
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getMeme } from "@/lib/redux/memeSlice"
import { RootState } from '@/lib/redux/store'
import { meme } from '@/lib/types'
export default function Page() {
  const dispatch = useDispatch()
  const [loading, setLoaing] = useState(false)
  const { memeList } = useSelector((state: RootState) => state.meme)
  const { currentUser } = useSelector((state: RootState) => state.user)
  useEffect(() => {
    const fetchData = () => {
      setLoaing(true)
      try {
        fetch('/api/meme/getAll')
        .then(res => res.json())
        .then(res => {
          const myMemes = res.data.filter((meme: meme) => meme.userRef === currentUser?._id)
          dispatch(getMeme(myMemes))
          setLoaing(false)
        }) 
      }
      catch (error) {
        console.log(error)  
        setLoaing(false)
      }
    }
    fetchData()
  }, [])
  return (
    <>
    {loading && <p className='text-center my-7 text-3xl font-bold'>Loading...</p>}
    {!loading && memeList &&
      <ul className='grid xl:grid-cols-5 gap-6 mt-10 p-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[400px]:gap-3'>
      {memeList.map((meme: meme) => 
        <MemeCard key={meme.firebaseName} meme={meme} mode='editable'/>
      )}
    </ul>
    }
    </>
  )
}
