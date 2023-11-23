import mongoose from "mongoose"
export default async function connectDB(){
    await mongoose.connect(process.env.DB_URL as string)
    .catch((err) => {
        console.log(err)
    })
}