import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import connectDB from "@/lib/connectDB"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dcalppd08",
  api_key: "521941113518647",
  api_secret: "P18AZVui5k7-GHHDKnXXOi8W7xU",
})


export async function POST(req: NextRequest) {
  await connectDB()

  const formData = await req.json()

  try {
    const chunks: any[] = []

      ytdl(formData.url)
        .on("data", (chunk) => {
          chunks.push(chunk)
        })
        .on("end", () => {
          const buffer = Buffer.concat(chunks)
          const fileString = buffer.toString("base64")

          cloudinary.uploader.upload(
            `data:video/mp4;base64,${fileString}`,
            {
              resource_type: "auto",
              public_id: `${new Date().getTime()}`,
              folder: "memes",
              format: "mp4",
            },
            (error, result) => {
              if (error) {
                throw new Error(error as any)
              }
            }
          )
        })
    return NextResponse.json({ data: 'pass' })
  } 
  catch (error) {
    return NextResponse.json({ error: new Error(error as any).message })
  }
}