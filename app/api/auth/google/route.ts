import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import User from "@/lib/models/userSchema"
import connectDB from '@/lib/connectDB'
export async function POST(req: NextRequest) {
    await connectDB()
    const formdata = await req.json()
    try {
        const user = await User.findOne({ email: formdata.email })
        if (user) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string)
          cookies().set('access_token', token, { httpOnly: true })
          return NextResponse.json({data: user, message: "Sign in success!"})
        } 
        else {
          const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
          const newUser = new User({
            username: formdata.name,
            email: formdata.email,
            password: generatedPassword,
            avatar: formdata.avatar,
          })
          await newUser.save()
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string)
          cookies().set('access_token', token, { httpOnly: true })
          return NextResponse.json({data: newUser, message: "Sign in success!"})
        }
      } 
      catch (error) {
        return NextResponse.json({error: error})
      }
}