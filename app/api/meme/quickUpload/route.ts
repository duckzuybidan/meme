import { NextRequest, NextResponse } from "next/server"
import ytdl from "ytdl-core"
import connectDB from "@/lib/connectDB"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: "dcalppd08",
  api_key: "521941113518647",
  api_secret: "P18AZVui5k7-GHHDKnXXOi8W7xU",
})

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 5000 // 5 seconds

const ytDownload = (url: string) => {
  return new Promise((resolve, reject) => {
    try {
      const chunks: any[] = []

      ytdl(url)
        .on("data", (chunk) => {
          chunks.push(chunk)
        })
        .on("end", () => {
          const buffer = Buffer.concat(chunks)
          const fileString = buffer.toString("base64")

          const options = {
            resource_type: "auto",
            public_id: `${new Date().getTime()}`,
            folder: "memes",
            format: "mp4",
          }

          uploadWithRetry(fileString, options)
            .then((result) => {
              resolve(result.url)
            })
            .catch((error) => {
              reject(error)
            })
        })
        .on("error", (error) => {
          reject(error)
        })
    } catch (error) {
      reject(error)
    }
  })
}

const uploadWithRetry = async (fileString: string, options: any, retryCount = 0) : Promise<any> => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(`data:video/mp4;base64,${fileString}`, options, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
    return result
  } catch (error) {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return uploadWithRetry(fileString, options, retryCount + 1)
    } else {
      throw error
    }
  }
}

export async function POST(req: NextRequest) {
  await connectDB()

  const formData = await req.json()
  try {
    const res = await ytDownload(formData.url)
    .then(res => {
      return res
    })
    .catch(error => {
      throw new Error(error)
    })
    return NextResponse.json({ data: res })
  } catch (error) {
    return NextResponse.json({ error: new Error(error as any).message })
  }
}