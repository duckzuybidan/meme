import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
export const revalidate = 5
const ytDownload = (url: string) => {
    return new Promise((resolve, reject) => {
        try{
            ytdl(url).pipe(fs.createWriteStream('/public/video.mp4')).on('finish', () => {
                resolve('Download success')
            })
        }
        catch(error){
            reject(error)
        }
    }) 
}
export async function GET(req: NextRequest) {
    await connectDB()
    const url = req.nextUrl.searchParams.get('url') || ''
    try{
        await ytDownload(url)
        .catch(error => {
            throw new Error(error)
        })
        return NextResponse.json({message: 'success'})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}