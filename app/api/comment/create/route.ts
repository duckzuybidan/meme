import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Comment from "@/lib/models/commentSchema"
export async function POST(req: NextRequest) {
    await connectDB()
    const formData = await req.json()
    let parentId = ''
    if(formData.parentId){
        parentId = formData.parentId
    }
    const newComment = new Comment({
        userId: formData.userId,
        memeId: formData.memeId,
        parentId: parentId,
        body: formData.body
    })
    try {
        await newComment.save();
        return NextResponse.json({data: newComment, message: "Success!"})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}