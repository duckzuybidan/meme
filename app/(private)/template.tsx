"use client"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { redirect } from 'next/navigation'
export default function PrivateLayout({children}: {children: React.ReactNode}) {
    const { currentUser } = useSelector((state : RootState) => state.user)
    return (
      <>
          {currentUser ? (children) : redirect('/')}
      </>
  )
}

