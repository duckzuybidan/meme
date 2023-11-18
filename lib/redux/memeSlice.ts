import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { meme } from '../types'
const initialState = { 
    memeList:[] as meme[],
}

const memeSlice = createSlice({
  name: 'meme',
  initialState,
  reducers: {
    getMeme: (state, action: PayloadAction<meme[]>) => {
      state.memeList = action.payload.reverse()
    },
    createMeme: (state, action: PayloadAction<meme>) => {
      state.memeList = [action.payload, ...state.memeList]
    },
    deleteMeme: (state, action: PayloadAction<string>) => {
    const newList = state.memeList.filter(meme => meme._id !== action.payload)
    state.memeList = newList
    },
    editMeme: (state, action: PayloadAction<meme>) => {
      const editedMemeIdx = state.memeList.findIndex(meme => meme._id == action.payload._id)
      state.memeList[editedMemeIdx] = action.payload

    },
  }
})

export const {
  getMeme,
  createMeme,
  deleteMeme,
  editMeme
} = memeSlice.actions

export default memeSlice.reducer