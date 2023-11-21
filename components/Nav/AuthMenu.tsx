"use client"
import { RootState } from "@/lib/redux/store"
import { signOut } from "@/lib/redux/userSlice"
import { Menu } from "@headlessui/react"
import Link from "next/link"
import toast from "react-hot-toast"
import { CgProfile } from "react-icons/cg"
import { BsPersonVideo } from "react-icons/bs"
import { GoSignOut } from "react-icons/go"
import { MdOutlineCreateNewFolder } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useContext } from "react"
import { ModalContext } from "@/lib/contexts/ModalContext"
import { modalContext } from "@/lib/types"
export default function AuthMenu() {
  const { currentUser } = useSelector((state : RootState) => state.user)
  const dispatch = useDispatch()
  const {setUploadModal} = useContext(ModalContext) as modalContext
  const handleUpload = () => {
    setUploadModal({
      open: true,
      meme: null,
      mode: 'create'
    })
  }
  const handleSignOut = () => {
    try {
      fetch('/api/auth/signout')
      .then(res => res.json())
      .then(res => {
        dispatch(signOut())
        toast.success("Sign out success!")
      })
    } 
    catch (error) {
      console.log(error)
    }
  }
  return (
    <Menu as='div' className='text-white font-semibold relative z-50'>
        <Menu.Button>
            <img
                src={currentUser?.avatar}
                alt={currentUser?.username}
                className="rounded-full w-[32px] h-[32px]"
            />
        </Menu.Button>
        <Menu.Items as='div' className='absolute p-2 bg-slate-300 w-32 right-[-20px] rounded-xl space-y-2'>
            <Menu.Item as= {Link} href='/profile' className='flex items-center bg-blue-400 p-0.5 rounded-md cursor-pointer hover:bg-opacity-70'>
              <CgProfile className='mr-1'/>
              Profile
            </Menu.Item>
            <Menu.Item as= {Link} href='/my-meme' className='flex items-center bg-blue-400 p-0.5 rounded-md cursor-pointer hover:bg-opacity-70'>
              <BsPersonVideo className='mr-1'/>
              My Meme
            </Menu.Item>
            <Menu.Item as= 'div' className='flex items-center bg-blue-400 p-0.5 rounded-md cursor-pointer hover:bg-opacity-70' onClick={handleUpload}>
              <MdOutlineCreateNewFolder className='mr-1'/>
              Create Meme
            </Menu.Item>
            <Menu.Item as='div' className='flex items-center bg-red-500 p-0.5 rounded-md cursor-pointer hover:bg-opacity-70' onClick={handleSignOut}>
              <GoSignOut className='mr-1'/>
              Sign Out
            </Menu.Item>
          </Menu.Items>
          </Menu>
  )
}
