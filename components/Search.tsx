import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { useSearchParams, useRouter } from 'next/navigation'

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()
    useEffect(() => {
        if(searchParams.get('searchTerm')){
            setSearchTerm(searchParams.get('searchTerm') as string)
        }
    }, [searchParams])
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        router.push(`result?${searchQuery}`)
    }
    return (
    <form 
        className="flex w-[320px] max-w-full items-center relative max-md:w-[240px]"
        onSubmit={handleSubmit}
    >
        <input 
            className="bg-neutral-700 w-full px-5 py-3 rounded-xl text-white"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <button 
            className="absolute right-5"
            type="submit"
        >
            <GoSearch className = 'text-white scale-150 text-lg cursor-pointer hover:text-blue-500'/>
        </button>
      
    </form>
  )
}
