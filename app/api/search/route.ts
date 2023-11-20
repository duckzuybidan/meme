import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export const revalidate = 5;
export async function GET(req: NextRequest) {
    await connectDB()
    const searchTerm = req.nextUrl.searchParams.get('searchTerm') || ''
    try{
        const memes = await Meme.find({
        title: { $regex: searchTerm, $options: 'i' }
    })
        return NextResponse.json({data: memes})
    }
    catch(error){
        return NextResponse.json({error: error})
    }
   
}