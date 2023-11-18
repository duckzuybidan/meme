import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export async function PUT(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    const data = await req.json()
    try {
        const meme = await Meme.findById(params.id)
        meme.likes.filter((id : string) => id !== data)
        await Meme.findByIdAndUpdate(
            params.id,
            {
                $set:{
                    likes: meme.likes.filter((id : string) => id !== data)
                }
            }
        )
        return NextResponse.json({message: "Success!"})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}