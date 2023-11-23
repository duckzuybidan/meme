"use client"
import SignInModal from "./SignInModal"
import SignUpModal from "./SignUpModal"
import { ModalContext } from '@/lib/contexts/ModalContext'
import { useContext, memo } from "react"
import UploadModal from "./UploadModal"
import DeleteModal from "./DeleteModal"
import { modalContext } from "@/lib/types"
import FiltersModal from "./FiltersModal"
import QuickUploadModal from "./QuickUploadModal"
export default memo(function Modals() {
    const {
      signInModal,
      setSignInModal,
      signUpModal,
      setSignUpModal,
      uploadModal,
      setUploadModal,
      deleteModal,
      setDeleteModal,
      filtersModal,
      setFiltersModal,
      quickUploadModal,
      setQuickUploadModal } = useContext(ModalContext) as modalContext
    return (
    <>
       <SignInModal modal={signInModal} onClose={() => setSignInModal({...signInModal, open: false})}/>
       <SignUpModal modal={signUpModal} onClose={() => setSignUpModal({...signUpModal, open: false})}/>
       <UploadModal modal={uploadModal} onClose={() => setUploadModal({...uploadModal, open: false})}/>
       <DeleteModal modal={deleteModal} onClose={() => setDeleteModal({...deleteModal, open: false})}/>
       <FiltersModal modal={filtersModal} onClose={() => setFiltersModal({...filtersModal, open: false})}/>
       <QuickUploadModal modal={quickUploadModal} onClose={() => setQuickUploadModal({...quickUploadModal, open: false})}/>
    </>
  )
})
