import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export const revalidate = 5;
export async function GET(req: NextRequest) {
    await connectDB()
    try {
        let data
        await Meme.find({})
        .then(memes => {
            data = memes
        })
        return NextResponse.json({data: data})
        
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}
