import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { formatInTimeZone } from "date-fns-tz"
import dotenv from 'dotenv'


// Environment Config
dotenv.config();


// Handle form submit
export async function POST(req: Request) {
    try {
        const { name, email, timeSlot, remark } = await req.json();

        const timeZone = "Asia/Kolkata";

        const startDate = new Date(timeSlot.date);
        const [startH, startM, startS] = timeSlot.startTime.split(":").map(Number);
        const [endH, endM, endS] = timeSlot.endTime.split(":").map(Number);

        const startLocal = new Date(startDate);
        startLocal.setHours(startH, startM, startS, 0);

        const endLocal = new Date(startDate);
        endLocal.setHours(endH, endM, endS, 0);

        const formattedStart = formatInTimeZone(startLocal, timeZone, "yyyyMMdd'T'HHmmss");
        const formattedEnd = formatInTimeZone(endLocal, timeZone, "yyyyMMdd'T'HHmmss");

        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Booking Invite//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${Date.now()}@yourdomain.com
DTSTAMP:${formatInTimeZone(new Date(), timeZone, "yyyyMMdd'T'HHmmss")}
DTSTART;TZID=${timeZone}:${formattedStart}
DTEND;TZID=${timeZone}:${formattedEnd}
SUMMARY:Consultation Booking with ${name}
DESCRIPTION:${remark}
LOCATION:Online / Office
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
    `.trim()

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        await transporter.sendMail({
            from: `${process.env.APP_NAME} <${process.env.EMAIL_ID}>`,
            to: email,
            subject: "Your Booking Confirmation",
            text: `Hello ${name},\n\nYour booking is confirmed.\n\nDate: ${startLocal.toDateString()}\nTime: ${timeSlot.startTime} - ${timeSlot.endTime} (${timeZone})\n\nRemark: ${remark}`,
            icalEvent: {
                filename: "invite.ics",
                method: "REQUEST",
                content: icsContent,
            },
        })

        const response = NextResponse.json({ message: "Form Submitted Successfully!" }, { status: 200 });
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;
    } catch (error) {
        console.error("Error sending invite:", error);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
