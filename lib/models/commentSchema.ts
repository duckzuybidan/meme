import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    userId:{
      type: String,
      require: true
    },
    memeId:{
      type: String,
      require: true
    },
    parentId:{
      type: String,
      require: true
    },
    body:{
      type: String,
      require: true,
    }
  },
  { timestamps: true } 
);

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment