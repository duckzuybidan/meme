"use client"
import React, { useState, createContext } from "react"
import { signInModal, signUpModal, uploadModal, deleteModal, modalContext, filtersModal } from "../types"
export const ModalContext = createContext<modalContext | null>(null)
export const ModalProvider = ({children} : { children: React.ReactNode }) => {
    const [signInModal, setSignInModal] = useState<signInModal>({
      open: false
    })
    const [signUpModal, setSignUpModal] = useState<signUpModal>({
      open: false
    })
    const [uploadModal, setUploadModal] = useState<uploadModal>({
      open: false,
      meme: null,
      mode: null
    })
    const [deleteModal, setDeleteModal] = useState<deleteModal>({
      open: false,
      meme: null
    })
    const [filtersModal, setFiltersModal] = useState<filtersModal>({
      open: false
    })
    return (
      <ModalContext.Provider value={{
            signInModal, 
            setSignInModal,
            signUpModal,
            setSignUpModal,
            uploadModal,
            setUploadModal,
            deleteModal,
            setDeleteModal,
            filtersModal,
            setFiltersModal
        }}>
        {children}
      </ModalContext.Provider>
    )
    }