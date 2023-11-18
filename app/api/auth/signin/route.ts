import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import User from "@/lib/models/userSchema"
import connectDB from '@/lib/connectDB'
export async function POST(req: NextRequest) {
    await connectDB()
    const formData = await req.json()
    try {
      const validUser = await User.findOne({ email: formData.email })
      if (!validUser){
        return NextResponse.json({
            error: 'Email not found!'
        })
      }
      const validPassword = (formData.password === validUser.password)
      if (!validPassword){
        return NextResponse.json({
            error: 'Wrong Password!'
        })
      }
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET as string)
      cookies().set('access_token', token, {httpOnly: true})
      return NextResponse.json({data: validUser, message: "Sign in success!"})
    } catch (error) {
      return NextResponse.json({error: error})
    }
}