import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
export const revalidate = 5
const ytDownload = async (url: string) => {
  try {
    const chunks: any[] = []
    const stream = ytdl(url)
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const fileString = buffer.toString("base64")
    return fileString
  } 
  catch (error) {
    throw new Error(error as any)
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') || ''
  try {
    const fileString = await ytDownload(url)
    return NextResponse.json({ data: fileString })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message })
  }
}