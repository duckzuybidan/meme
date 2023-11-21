import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export async function PUT(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    const formData = await req.json()
    try {
        await Meme.findByIdAndUpdate(
            params.id,
            {
                $set: {
                    downloads: formData.downloads
                },
            },
            { new: true }
        )
        return NextResponse.json({message: "Success!"})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}