import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export const revalidate = 5;
export async function GET(req: NextRequest) {
    await connectDB()
    try {
        const data = await Meme.find({}).sort({createdAt: -1})
        return NextResponse.json({data: data})
        
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}
