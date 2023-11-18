"use client"
import SignInModal from "./SignInModal"
import SignUpModal from "./SignUpModal"
import { ModalContext } from '@/lib/contexts/ModalContext'
import { useContext, memo } from "react"
import UploadModal from "./UploadModal"
import DeleteModal from "./DeleteModal"
import { modalContext } from "@/lib/types"
export default memo(function Modals() {
    const {
      signInModal,
      setSignInModal,
      signUpModal,
      setSignUpModal,
      uploadModal,
      setUploadModal,
      deleteModal,
      setDeleteModal } = useContext(ModalContext) as modalContext
    return (
    <>
       <SignInModal modal={signInModal} onClose={() => setSignInModal({open: false})}/>
       <SignUpModal modal={signUpModal} onClose={() => setSignUpModal({open: false})}/>
       <UploadModal modal={uploadModal} onClose={() => setUploadModal({open: false})}/>
       <DeleteModal modal={deleteModal} onClose={() => setDeleteModal({open: false})}/>
    </>
  )
})
