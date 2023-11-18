import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import User from "@/lib/models/userSchema"
export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    try {
        let data
        await User.findById(params.id)
        .then(user => {
            data = user
        })
        return NextResponse.json({data: data})
    } 
    catch (error) {
        return NextResponse.json({error: error})
    }
}