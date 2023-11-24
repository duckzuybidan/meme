import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
import path from "path"
const ytDownload = (url: string) => {
    return new Promise((resolve, reject) => {
        try{
            ytdl(url).pipe(fs.createWriteStream(path.join(process.cwd(), '/video.mp4'))).on('finish', async () => {
                
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
        .then(message => console.log(message))
        .catch(error => {
            throw new Error(error)
        })
        return NextResponse.json({message: path.join(process.cwd(), '/public/video.mp4')})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}