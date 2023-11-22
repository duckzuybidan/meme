import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { comment } from '../types'
const initialState = { 
    commentList:[] as comment[],
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    getComment: (state, action: PayloadAction<comment[]>) => {
      state.commentList = action.payload
    },
    createComment: (state, action: PayloadAction<comment>) => {
      state.commentList = [action.payload, ...state.commentList]
    },
    deleteComment: (state, action: PayloadAction<string>) => {
    const newList = state.commentList.filter(comment => comment._id !== action.payload)
    state.commentList = newList
    },
    editComment: (state, action: PayloadAction<comment>) => {
      const editedMemeIdx = state.commentList.findIndex(comment => comment._id == action.payload._id)
      state.commentList[editedMemeIdx] = action.payload

    },
  }
})

export const {
  getComment,
  createComment,
  deleteComment,
  editComment
} = commentSlice.actions

export default commentSlice.reducer