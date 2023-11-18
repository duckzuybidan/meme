import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export async function GET(req: NextRequest) {
    await connectDB()
    try {
        let searchTerm = req.nextUrl.searchParams.get('searchTerm') || ''
        const memes = await Meme.find({
            title: { $regex: searchTerm, $options: 'i' }
        })
        return NextResponse.json({data: memes})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}