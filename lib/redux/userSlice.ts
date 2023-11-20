import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { user } from '../types'
const initialState = {
  currentUser: null as user | null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<user>) => {
      state.currentUser = action.payload
    },
    signOut: (state) => {
      state.currentUser = null
    },
    updateUser: (state, action: PayloadAction<user>) => {
      state.currentUser = action.payload
    }
  }
})

export const {
  signIn,
  signOut,
  updateUser
} = userSlice.actions

export default userSlice.reducer