"use client"
import { GoSearch } from "react-icons/go"
import { IoIosArrowDropdown } from "react-icons/io"
import { ModalContext } from '@/lib/contexts/ModalContext'
import { useContext } from "react"
import { useSelector, useDispatch  } from "react-redux"
import { RootState } from "@/lib/redux/store"
import Link from "next/link"
import { Menu } from "@headlessui/react"
import AuthMenu from "./AuthMenu"
import Image from "next/image"
import { modalContext } from "@/lib/types"
import Search from "../Search"

export default function Topbar() {
    const { currentUser } = useSelector((state : RootState) => state.user)
    const {setSignInModal, setSignUpModal} = useContext(ModalContext) as modalContext
    const handleSignIn = () => setSignInModal({open: true})
    const handleSignUp = () => setSignUpModal({open: true})
    return (
     <nav className="flex flex-col top-0 w-full bg-black px-5">
     <div className="self-center flex items-center w-full max-w-[1440px] items-start justify-between gap-5 my-5 max-md:max-w-full max-md:flex-wrap max-md:justify-center relative">
      <Link className="justify-center items-start flex gap-0.5 my-auto cursor-pointer" href='/'>
        <Image
            className="rounded-full"
            src='/logo.svg'
            alt="logo"
            width={32}
            height={32}
            priority
        />
        <span className="text-white text-xl font-semibold">
          Meme Store
        </span>
      </Link>
      <Search/>
      <div className="my-auto">
        {currentUser ? (
          <AuthMenu/>
        ) : (
        <div className="max-md:hidden flex gap-x-5">
          <button 
            className="bg-red-500 text-white text-lg font-semibold hover:text-black p-2 rounded-lg" 
            onClick={handleSignIn}
          >
            SIGN IN
          </button>
          <button 
            className="bg-red-500 text-white text-lg font-semibold hover:text-black p-2 rounded-lg"
            onClick={handleSignUp}
          >
            SIGN UP
          </button>
        </div>
        )}
      </div>
      <div className="md:hidden md:h-[32px] md:w-[32px]">
        {!currentUser && 
          <Menu as='div' className='text-white font-semibold relative'>
            <Menu.Button>
              <IoIosArrowDropdown className='text-white w-[32px] h-[32px]'/>
            </Menu.Button>
            <Menu.Items as="ul" className='absolute p-2 bg-slate-300 w-28 right-[-20px] rounded-xl space-y-1 mt-2'>
              <Menu.Item as='li' className='flex items-center bg-red-500 p-0.5 rounded-md cursor-pointer' onClick={handleSignIn}>
                SIGN IN
              </Menu.Item>
              <Menu.Item as='li' className='flex items-center bg-red-500 p-0.5 rounded-md cursor-pointer' onClick={handleSignUp}>
                SIGN UP
              </Menu.Item>
            </Menu.Items>
          </Menu>
        }
      </div>
    </div>
  </nav>
  )
}
