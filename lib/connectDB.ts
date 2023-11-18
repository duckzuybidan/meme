import mongoose from "mongoose"
export default async function connectDB(){
    await mongoose.connect(process.env.DB_URL as string)
    .then(() => {
        console.log('Connected to MongoDB!')
    })
    .catch((err) => {
        console.log(err)
    })
}