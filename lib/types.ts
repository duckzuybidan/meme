interface modal {
    open:boolean,
    
}
export interface signInModal extends modal {}
export interface signUpModal extends modal {}
export interface uploadModal extends modal {
    meme: meme | null
    mode: 'create' | 'edit'
}
export interface deleteModal extends modal {
  meme: meme | null
}
  export interface modalContext {
    signInModal: signInModal,
    setSignInModal: React.Dispatch<React.SetStateAction<signInModal>>,
    signUpModal: signUpModal,
    setSignUpModal: React.Dispatch<React.SetStateAction<signUpModal>>,
    uploadModal: uploadModal,
    setUploadModal: React.Dispatch<React.SetStateAction<uploadModal>>,
    deleteModal: deleteModal,
    setDeleteModal: React.Dispatch<React.SetStateAction<deleteModal>>
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
