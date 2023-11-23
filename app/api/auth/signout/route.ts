import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
export const dynamic = "force-dynamic"
export async function GET(req: NextRequest) {
    try {
       cookies().delete('access_token')
       return NextResponse.json({message: "Sign out success!"}) 
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}