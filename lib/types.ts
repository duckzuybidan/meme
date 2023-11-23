
export interface signInModal {
    open:boolean,
}
export interface signUpModal {
    open:boolean,
}
export interface uploadModal {
    open:boolean, 
    meme: meme | null
    mode: 'create' | 'edit' | null
}
export interface deleteModal {
    open:boolean,
    meme: meme | null
}
export interface filtersModal {
    open:boolean,
}
export interface quickUploadModal{
    open: boolean
}
export interface modalContext {
    signInModal: signInModal,
    setSignInModal: React.Dispatch<React.SetStateAction<signInModal>>,
    signUpModal: signUpModal,
    setSignUpModal: React.Dispatch<React.SetStateAction<signUpModal>>,
    uploadModal: uploadModal,
    setUploadModal: React.Dispatch<React.SetStateAction<uploadModal>>,
    deleteModal: deleteModal,
    setDeleteModal: React.Dispatch<React.SetStateAction<deleteModal>>,
    filtersModal: filtersModal,
    setFiltersModal: React.Dispatch<React.SetStateAction<filtersModal>>,
    quickUploadModal: quickUploadModal,
    setQuickUploadModal: React.Dispatch<React.SetStateAction<quickUploadModal>>,
}

export interface user{
    _id: string,
    username: string,
    email: string,
    password: string,
    avatar: string
  }

export interface meme {
    _id: string
    title: string,
    description: string,
    url: string,
    tags: string[],
    type: string,
    userRef: string,
    firebaseName: string,
    downloads: number,
    likes: string[]
}

export interface comment{
  _id: string,
  userId: string,
  memeId: string,
  parentId: string,
  body: string,
}
