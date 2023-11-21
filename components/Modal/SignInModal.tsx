"use client"
import {ModalContext } from '@/lib/contexts/ModalContext'
import { useContext, useState } from 'react'
import { HiOutlineXMark } from "react-icons/hi2"
import OAuth from '../OAuth'
import { signIn } from '@/lib/redux/userSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { user, modalContext, signInModal } from "@/lib/types"
export default function SignInModal({modal, onClose}: {modal: signInModal, onClose: () => void}) {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const { setSignInModal, setSignUpModal } = useContext(ModalContext) as modalContext
  const dispatch = useDispatch()
  if(!modal.open){
    return
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  const handleSubmit = (e : React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setLoading(false)
          toast.error(res.error)
          return
        }
        dispatch(signIn(res.data as user))
        toast.success(res.message)
        setLoading(false)
        onClose()
      })
    } 
    catch (error) {
      setLoading(false)
      console.log(error)
    }

  }
  return (
    <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
      <form 
        className='self-center flex flex-col items-center gap-y-6 w-1/2 h-max bg-slate-100 rounded-2xl p-3 max-md:w-5/6 relative'
        onSubmit={handleSubmit}
      >
        <HiOutlineXMark 
          className='absolute top-3 right-3 scale-150 cursor-pointer md:hover:text-red-500 max-md:active:text-red-500'
          onClick={onClose}
        />
        <h1 className='font-bold text-5xl text-neutral-800'>SIGN IN</h1>
        <input
          className='border-none w-1/2 p-3 rounded-lg'
          type="email" 
          placeholder='Email..'
          id="email"
          onChange={handleChange}
          required
         />
         <input
          className='border-none w-1/2 p-3 rounded-lg'
          type="password" 
          placeholder='Password...'
          id="password"
          onChange={handleChange}
          required
         />
         <button
          className='bg-emerald-300 w-1/3 rounded-lg p-3 font-bold text-white'
          type='submit'
          disabled={loading}
         >
          {loading ? 'Loading...' : 'SIGN IN'}
         </button>
         <OAuth/>
         <p>Do not have an account? 
          <span 
            className='text-red-500 cursor-pointer ml-1' 
            onClick={() => {
              setSignInModal({open:false})
              setSignUpModal({open:true})
            }}
          >
          Sign up
          </span>
         </p>
      </form>
    </div>
  )
}
