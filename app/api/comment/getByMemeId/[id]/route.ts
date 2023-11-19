import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Comment from "@/lib/models/commentSchema"
export const revalidate = 5;
export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    try {
        let data
        await Comment.find({memeId: params.id})
        .then(comments => {
            data = comments
        })
        return NextResponse.json({data: data})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}
