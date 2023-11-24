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

export async function POST(req: NextRequest) {
    await connectDB()
    const formData = await req.json() 
        try{
            ytdl(formData.url).pipe(fs.createWriteStream(path.join(process.cwd() + '/tmp/video.mp4'))).on('finish', async () => {
                const fileBuffer  = fs.readFileSync(path.join(process.cwd() + '/tmp/video.mp4'))
                const fileString = fileBuffer.toString('base64');
                cloudinary.uploader.upload(
                    `data:video/mp4;base64,${fileString}`,
                    {
                    resource_type: 'auto',
                      public_id: `${new Date().getTime()}`, 
                      folder: 'memes',      
                      format: 'mp4',                
                    },
                    (error, result) => {
                      if (error) {
                        throw (error)
                      } 
                      else {
                        fs.unlinkSync(path.join(process.cwd() + '/tmp/video.mp4'))
                      }
                    }
                  )
                    
            })
        return NextResponse.json({data: ''})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }   
}