"use client"
import MemeCard from "@/components/Meme/MemeCard"
import { getMeme } from "@/lib/redux/memeSlice"
import { RootState } from "@/lib/redux/store"
import { meme } from "@/lib/types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"


export default function HashTag({params}: {params: {tag: string}}) {
    const [loading, setLoading] = useState(false)
    const { memeList } = useSelector((state: RootState) => state.meme)
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchData = () => {
          setLoading(true)
          try {
            fetch(`/api/meme/getByTag/${params.tag}`, {
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
    }, [params.tag, dispatch])
    return (
        <>
        {loading && <p className='text-center my-7 text-3xl font-bold'>Loading...</p>}
        {!loading && memeList &&
        <>
            <div className="m-5">
            <h1 className="font-bold text-3xl">Hash Tag: #{params.tag}</h1>
            {memeList.length === 0 && <p>No result</p>}
            {memeList.length === 1 && <p>1 result</p>}
            {memeList.length > 1 && <p>{memeList.length} results</p>}
            </div>
            <ul className='grid xl:grid-cols-5 gap-6 mt-10 p-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[400px]:gap-3'>
             {memeList.map((meme: meme) => 
             <MemeCard key={meme.firebaseName} meme={meme} mode='watchOnly'/>
            )}
            </ul>
        </>
        }
        </>
  )
}

