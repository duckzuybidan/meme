import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Comment from "@/lib/models/commentSchema"
export async function PUT(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    const data = await req.json()
    try {
      const editedComment = await Comment.findByIdAndUpdate(
        params.id,
        {
          $set: {
            body: data
          },
        },
        { new: true }
    )
      return NextResponse.json({data: editedComment, message: "Upload successfully!"})
    } 
    catch (error) {
      return NextResponse.json({error: new Error(error as any).message})
    }
}