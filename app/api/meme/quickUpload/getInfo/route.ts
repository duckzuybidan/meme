import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
export const revalidate = 5
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') || ''
  try {
    const info = await ytdl.getInfo(url)
    const formats = info.formats.filter(format =>  
      parseInt(format.contentLength) < 30 * 1024 * 1024 &&
      format.hasAudio)
    
    return NextResponse.json({
        formats: formats,
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[2].url
    })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message })
  }
}