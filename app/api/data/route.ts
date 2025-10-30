// Helper Libs
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";


// Environment Config
dotenv.config();


// Post Request to send email of responses
export async function POST(request: NextRequest) {
    try {
        const { data } = await request.json();
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token Not Found!" }, { status: 404 });
        }

        const { email } = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const formattedResponses = data
            .map(
                (item: { question: string; answer: string }, index: number) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.question}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.answer}</td>
        </tr>
      `
            )
            .join("");

        const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>📝 Marketing Questionnaire Responses</h2>
        <p>Here are your submitted answers:</p>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="padding: 8px; border: 1px solid #ddd;">#</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Question</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Your Answer</th>
            </tr>
          </thead>
          <tbody>
            ${formattedResponses}
          </tbody>
        </table>
        <p style="margin-top: 20px;">Thank you for completing the marketing questionnaire!</p>
        <p style="margin-top: 20px;">We will get back to you shortly with more insights!</p>
      </div>
    `;

        await transporter.sendMail({
            from: `"Marketing Survey" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Marketing Questionnaire Responses",
            html: htmlContent,
        });

        const response = NextResponse.json(
            { message: "✅ Responses submitted and email sent successfully. Logout Successful" },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;

    } catch (error) {
        console.error("❌ Error occurred:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
