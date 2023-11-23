import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Comment from "@/lib/models/commentSchema"
export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
    await connectDB()
    try {
        await Comment.findByIdAndDelete(params.id)
        await Comment.deleteMany({parentId: params.id})
        return NextResponse.json({data: params.id, message: "Delete successfully!"})
        
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}