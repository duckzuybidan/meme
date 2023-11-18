import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export async function PUT(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    const formData = await req.json()
    
    try {
      const editedMeme = await Meme.findByIdAndUpdate(
        params.id,
        {
          $set: {
            title: formData.title,
            description: formData.description,
            tags: formData.tags
          },
        },
        { new: true }
    )
      return NextResponse.json({data: editedMeme, message: "Upload successfully!"})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}