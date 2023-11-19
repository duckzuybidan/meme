import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export const revalidate = 5;
export async function GET(req: NextRequest, {params}: {params: {queries: string[]}}) {
    await connectDB()
    try{
        const memes = await Meme.find({
        title: { $regex: params.queries[0], $options: 'i' }
    })
        return NextResponse.json({data: memes})
    }
    catch(error){
        return NextResponse.json({error: error})
    }
   
}