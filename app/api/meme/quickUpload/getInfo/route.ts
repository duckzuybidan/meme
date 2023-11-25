import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
export const revalidate = 5
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') || ''
  try {
    const info = await ytdl.getInfo(url)
    const checkDuration = parseInt(info.formats.find(formats => formats.hasVideo)?.approxDurationMs as string) > 5 * 60 * 1000
    if(checkDuration){
      return NextResponse.json({error: 'Duration must less than 5 minutes'})
    }
    const tmpFormats = info.formats.filter(format => {
      if(format.contentLength){
        return parseInt(format.contentLength) < 30 * 1024 * 1024 && format.mimeType?.includes('video/mp4') && format.hasAudio
      }
      return format.mimeType?.includes('video/mp4') && format.hasAudio 
    })
    const fileSize : number[] = []
    for (const format of tmpFormats){
      const size = await fetch(format.url).then(res => res.blob()).then(res => {return res.size})
      fileSize.push(size)
    }
    const formats = tmpFormats.filter((format, i) => fileSize[i] < 30 * 1024 * 1024)
    return NextResponse.json({
        formats: formats,
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[2].url,
        fileSize: fileSize
    })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message })
  }
}