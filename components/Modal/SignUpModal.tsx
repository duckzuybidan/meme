"use client"
import { ModalContext } from '@/lib/contexts/ModalContext'
import { HiOutlineXMark } from "react-icons/hi2"
import { useContext, useState } from 'react'
import OAuth from '../OAuth'
import toast from 'react-hot-toast'
import { modalContext, signUpModal} from "@/lib/types"
export default function SignUpModal({modal, onClose}: {modal: signUpModal, onClose: () => void}) {
  const { setSignInModal, setSignUpModal } = useContext(ModalContext) as modalContext
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
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
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setLoading(false)
          toast.error(res.error)
          throw new Error(res.error)
        }
        toast.success(res.message)
        setLoading(false)
        onClose()
      })
      .catch(error => console.log(error))
    } 
    catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div className='flex flex-col justify-center fixed top-0 z-50 w-screen h-screen bg-black bg-opacity-70'>
      <form 
        className='self-center flex flex-col items-center gap-y-4 w-1/2 h-max bg-slate-100 rounded-2xl max-md:w-5/6 p-3 relative'
        onSubmit={handleSubmit}
      >
        <HiOutlineXMark 
          className='absolute top-3 right-3 scale-150 cursor-pointer md:hover:text-red-500 max-md:active:text-red-500'
          onClick={onClose}
        />
        <h1 className='font-bold text-5xl text-neutral-800'>SIGN UP</h1>
        <input
          className='border-none w-1/2 p-3 rounded-lg'
          type="text" 
          placeholder='Username...'
          id="username"
          onChange={handleChange}
          required
         />
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
          {loading ? 'Loading...' : 'SIGN UP'}
         </button>
         <OAuth/>
         <p>Already have an account? 
          <span 
            className='text-red-500 cursor-pointer ml-1' 
            onClick={() => {
              setSignUpModal({open:false})
              setSignInModal({open:true})
            }}
          >
          Sign in
          </span>
         </p>
      </form>
    </div>
  )
}
