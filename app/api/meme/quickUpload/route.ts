import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
import admin from 'firebase-admin'
const ytDownload = (url: string) => {
    return new Promise((resolve, reject) => {
        try{
            ytdl(url).pipe(fs.createWriteStream(process.cwd() + '/public/video.mp4')).on('finish', async () => {
                
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
    const path = process.cwd() + '/public/video.mp4'
    try{
        await ytDownload(formData.url)
        .then(message => console.log(message))
        .catch(error => {
            throw new Error(error)
        })
        return NextResponse.json({message: path})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}