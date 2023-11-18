export interface modal {
    open:boolean,
    meme?: meme
    mode?: 'create' | 'edit'
}
  export interface modalContext {
    signInModal: modal,
    setSignInModal: React.Dispatch<React.SetStateAction<modal>>,
    signUpModal: modal,
    setSignUpModal: React.Dispatch<React.SetStateAction<modal>>,
    uploadModal: modal,
    setUploadModal: React.Dispatch<React.SetStateAction<modal>>,
    deleteModal: modal,
    setDeleteModal: React.Dispatch<React.SetStateAction<modal>>
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
