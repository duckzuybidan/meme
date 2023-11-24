import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
export const revalidate = 5
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dcalppd08",
  api_key: "521941113518647",
  api_secret: "P18AZVui5k7-GHHDKnXXOi8W7xU",
})
const ytDownload = async (url: string) => {
  try {
    const chunks: any[] = []
    const stream = ytdl(url)
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const fileString = buffer.toString("base64")
    await cloudinary.uploader.upload(
      `data:video/mp4;base64,${fileString}`,
      {
        resource_type: "auto",
        public_id: `${new Date().getTime()}`,
        folder: "memes",
        format: "mp4",
      }
    )
  } 
  catch (error) {
    throw new Error(error as any)
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url') || ''
  try {
    await ytDownload(url)
    return NextResponse.json({ data: 'pass' })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message })
  }
}