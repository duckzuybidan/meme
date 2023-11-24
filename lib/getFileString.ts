"use server"
import ytdl from "ytdl-core"
export async function getFileString(url: string) : Promise<string> {
    try {
      const chunks: any[] = []
      const stream = ytdl(url)
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)
      const fileString = buffer.toString("base64")
      return '123'
    } 
    catch (error) {
      throw new Error(error as any)
    }
}