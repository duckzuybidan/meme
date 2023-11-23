import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
import Comment from "@/lib/models/commentSchema"
export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
    await connectDB()
    try {
        await Meme.findByIdAndDelete(params.id)
        await Comment.deleteMany({memeId: params.id})
        return NextResponse.json({data: params.id, message: "Delete successfully!"})
        
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}
