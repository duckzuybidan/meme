import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
export const revalidate = 5
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
export async function GET(req: NextRequest, {params}: {params: {url:string}}) {
    await connectDB()
    try{
        await ytDownload(params.url)
        .then(message => console.log(message))
        .catch(error => {
            throw new Error(error as any)
        })
        return NextResponse.json({message: 'success'})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}