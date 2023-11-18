"use client"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { useRouter } from 'next/navigation'
export default function PrivateLayout({children}: {children: React.ReactNode}) {
    const { currentUser } = useSelector((state : RootState) => state.user)
    const router = useRouter()
    return (
      <>
          {currentUser ? (children) : router.push('/')}
      </>
  )
}

