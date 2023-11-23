import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Comment from "@/lib/models/commentSchema"
export const revalidate = 5;
export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    try {
        
        const data = await Comment.find({memeId: params.id}).sort({createdAt: -1})
        return NextResponse.json({data: data})
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}
