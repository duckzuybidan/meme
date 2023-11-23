import connectDB from "@/lib/connectDB";
import User from "@/lib/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    await connectDB()
    const formData = await req.json()
    const existUser = await User.findOne({email: formData.email})
    if(existUser){
        return NextResponse.json({
            error: 'Email existed!'
        })
    }
    const newUser = new User({ username : formData.username, email: formData.email, password: formData.password });
    try {
        await newUser.save()
        return NextResponse.json({
            message: 'Sign up success!'
        })
    } 
    catch (error) {
        return NextResponse.json({error: new Error(error as any).message})
    }
}

