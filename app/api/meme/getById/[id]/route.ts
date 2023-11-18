import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    try {
        let data
        await Meme.findById(params.id)
        .then(meme => {
            data = meme
        })
        return NextResponse.json({data: data})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}
