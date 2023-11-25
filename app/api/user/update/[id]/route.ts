import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import User from "@/lib/models/userSchema"
import connectDB from "@/lib/connectDB"
export async function PUT(req: NextRequest, {params}: {params: {id:string}}) {
    await connectDB()
    const token = cookies().get('access_token')
    if(!token){
    return NextResponse.json({error: 'Unauthorized'}) 
    }
    jwt.verify(token.value, process.env.JWT_SECRET as string, (err, id) => {
        if(err){
            return NextResponse.json({error: 'Forbidden'})
        }
        if(params.id != id){
            return NextResponse.json({error: 'You can only update your own data!'})
        }
    })
    const formData = await req.json()
    try {
        const updatedUser = await User.findByIdAndUpdate(
          params.id,
          {
            $set: {
              username: formData.username,
              password: formData.password,
              avatar: formData.avatar
            },
          },
          { new: true }
        )
        return NextResponse.json({data: updatedUser, message: "Update success!"})
      } 
      catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
      }
}