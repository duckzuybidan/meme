import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
import path from "path"
const ytDownload = (url: string) => {
    return new Promise((resolve, reject) => {
        try{
            ytdl(url).pipe(fs.createWriteStream(path.join(process.cwd(), '/public/video'))).on('finish', async () => {
                
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
    const p = path.join(process.cwd(), '/public/video')
    try{
        await ytDownload(formData.url)
        .then(message => console.log(message))
        .catch(error => {
            throw new Error(error)
        })
        return NextResponse.json({message: p})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}