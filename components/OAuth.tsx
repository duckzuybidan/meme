"use client"
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../lib/firebase'
import toast from 'react-hot-toast'
import { signIn } from '@/lib/redux/userSlice'
import { useDispatch } from 'react-redux'
import { ModalContext } from '@/lib/contexts/ModalContext'
import { useContext, useState } from 'react'
import { modalContext } from '@/lib/types'

export default function OAuth() {
  const { setSignInModal, setSignUpModal } = useContext(ModalContext) as modalContext
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const handleGoogleClick = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({prompt: 'select_account'})
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)
      fetch('/api/auth/google', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        })
      })
      .then(res => res.json())
      .then(res => {
        setLoading(false)
        toast.success(res.message)
        dispatch(signIn(res.data))
      })
      .then(() => {
        setSignInModal({open: false})
        setSignUpModal({open: false})
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <button
        onClick={handleGoogleClick}
        type='button'
        className='bg-red-700 w-1/3 text-white p-3 rounded-lg text-sm'
        disabled={loading}
    >
        {loading ? 'Loading...' : 'CONTINUE WITH GOOGLE'}
    </button>
  )
}
