import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import fs from 'fs'
import connectDB from '@/lib/connectDB'
import path from "path"
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
    cloud_name: 'dcalppd08',
    api_key: '521941113518647',
    api_secret: 'P18AZVui5k7-GHHDKnXXOi8W7xU'
  });
const ytDownload = (url: string) => {
    return new Promise((resolve, reject) => {
        try{
            
            
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
      const video = ytdl(formData.url).pipe(fs.createWriteStream(path.join(process.cwd() + '/tmp/video.mp4')))
      video.on('finish', async () => {
          
      })
        return NextResponse.json({data: '123'})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}