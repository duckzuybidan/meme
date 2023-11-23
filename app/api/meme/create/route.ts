import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export async function POST(req: NextRequest) {
    await connectDB()
    const formData = await req.json()
    const newMeme = new Meme({
        title: formData.title,
        description: formData.description || '',
        url: formData.url,
        tags: formData.tags || '',
        type: formData.type,
        userRef: formData.userRef,
        firebaseName: formData.firebaseName,
        downloads: 0,
        likes: []
    })
    try {
        await newMeme.save();
        return NextResponse.json({data: newMeme, message: "Upload successfully!"})
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}