import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
const ytDownload = (url: string) => {
    return new Promise((resolve, reject) => {
        try{
            ytdl(url).pipe(fs.createWriteStream('public/video.mp4')).on('finish', () => {
                resolve('Download success')
            })
        }
        catch(error){
            reject(error)
        }
    }) 
}
export async function POST(req: NextRequest) {
    await connectDB()
    const formData = await req.json()
    try{
        await ytDownload(formData.url)
        .catch(error => {
            throw new Error(error as any)
        })
        return NextResponse.json({message: 'success'})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}