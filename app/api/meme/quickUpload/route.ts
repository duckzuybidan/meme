import { NextRequest, NextResponse } from "next/server"
import ytdl from "@distube/ytdl-core"
export async function POST(req: NextRequest) {
  const {url, format} = await req.json()
  try {
    const chunks: any[] = []
    const stream = ytdl(url, {
      format: format
    })
    for await (const chunk of stream) {
        chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const fileString = buffer.toString("base64")

    return new NextResponse(fileString,{
      headers:{
        'Content-Type': 'text/plain',
      }
    })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message }, {headers: {
      'Content-Type': `application/json`,
    }})
  }
}