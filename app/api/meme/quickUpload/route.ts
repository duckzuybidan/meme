import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
export const revalidate = 5
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') || ''
  try {
    const chunks: any[] = []
    const stream = ytdl(url)
    
    for await (const chunk of stream) {
        chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const fileString = buffer.toString("base64")
    const body = await fetch(`data:video/mp4;base64,${fileString}`)
    .then(res => res.blob())
    console.log(body)
    return new NextResponse(body,{
      headers:{
        'Content-Type': `${body.type}`,
      }
    })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message }, {headers: {
      'Content-Type': `application/json`,
    }})
  }
}