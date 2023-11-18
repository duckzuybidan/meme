import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      require:true,
      default: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
    },

  },
  { timestamps: true}
);
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User