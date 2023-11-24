import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dcalppd08",
  api_key: "521941113518647",
  api_secret: "P18AZVui5k7-GHHDKnXXOi8W7xU",
})
export async function POST(req: NextRequest) {
    const formData = await req.json()
    try {
        const res = await cloudinary.uploader.upload(
            `data:video/mp4;base64,${formData.fileString}`,
            {
              resource_type: "auto",
              public_id: `${new Date().getTime()}`,
              folder: "memes",
              format: "mp4",
            }
        )
        return NextResponse.json({data: res})
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}