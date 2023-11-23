import { NextRequest, NextResponse } from "next/server"
import connectDB from '@/lib/connectDB'
import Meme from "@/lib/models/memeSchema"
export const revalidate = 5;
export async function GET(req: NextRequest) {
    await connectDB()
    const searchTerm = req.nextUrl.searchParams.get('searchTerm') || ''
    const sortBy = req.nextUrl.searchParams.get('sortBy') || ''
    const getVideo = req.nextUrl.searchParams.get('getVideo') === 'false' ? false : true
    const getImage = req.nextUrl.searchParams.get('getImage') === 'false' ? false : true
    
    const getType = ['video', 'image']
    !getVideo && getType.splice(getType.indexOf('video'), 1)
    !getImage && getType.splice(getType.indexOf('image'), 1) 
    let sortField : string = 'createdAt' 
    switch(sortBy){
        case 'topDownload': 
            sortField = 'downloads'
            break
        case 'topLike':
            sortField = 'likes'
            break
    }
    try{
        const memes = await Meme
        .find({
            title: { $regex: searchTerm, $options: 'i' },
            type: {$in: getType}
        })
        .sort({
            [`${sortField}`]: -1,
            ['createdAt']: -1

        })
        return NextResponse.json({data: memes})
    }
    catch(error){
        return NextResponse.json({error: new Error(error as any).message})
    }
   
}