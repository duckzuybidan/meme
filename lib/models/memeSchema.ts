import mongoose from 'mongoose'

const memeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true
    },
    url: {
      type: String,
      required: true,
    },
    tags:{
      type: Array<String>,
      require: true
    },
    type:{
      type:String,
      require: true
    },
    userRef:{
        type: String,
        required: true,
    },
    firebaseName:{
      type: String,
      require: true,
    },
    downloads:{
      type: Number,
      require: true,
    },
    likes:{
      type: Array<String>,
      require: true,
    }
  },
  { timestamps: true } 
);

const Meme = mongoose.models.Meme || mongoose.model('Meme', memeSchema)

export default Meme