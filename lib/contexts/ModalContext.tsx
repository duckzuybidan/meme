"use client"
import React, { useState, createContext } from "react"
import { modal, modalContext } from "../types"
export const ModalContext = createContext<modalContext | null>(null)
export const ModalProvider = ({children} : { children: React.ReactNode }) => {
    const [signInModal, setSignInModal] = useState<modal>({
      open: false
    })
    const [signUpModal, setSignUpModal] = useState<modal>({
      open: false
    })
    const [uploadModal, setUploadModal] = useState<modal>({
      open: false,
      mode: 'create'
    })
    const [deleteModal, setDeleteModal] = useState<modal>({
      open: false,
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
            setDeleteModal
        }}>
        {children}
      </ModalContext.Provider>
    )
    }