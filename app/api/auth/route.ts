import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"


// Environment Setup
dotenv.config();


// Login User
export async function POST(request: NextRequest) {
    try {

        const { email } = await request.json();

        const response = NextResponse.json({ message: "Login Successful" }, { status: 200 });

        const token = jwt.sign({
            email: email,
        },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d",
            }
        );

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 1
        });

        return response;

    } catch (error) {
        console.error("Error occured - ", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}