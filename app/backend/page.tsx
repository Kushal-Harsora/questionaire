'use client';

import { DevModeToggle } from "@/components/custom/dev-toggle-theme";
import React from "react";

interface Participant {
    name: string;
    role: string;
}

interface Message {
    sender: string;
    content: string;
}

const participants: Participant[] = [
    { name: "Rahul", role: "Founder" },
    { name: "Priya", role: "Founder" },
    { name: "Ravi", role: "Founderr" },
    { name: "Anita", role: "Founder" },
    { name: "John Doe", role: "Client / Marketing Manager" },
];

const transcript: Message[] = [
    { sender: "Rahul", content: "Good morning, John. Thanks for taking the time today." },
    { sender: "John Doe", content: "Morning, everyone. Our primary goal is to increase awareness and engagement for our new product line." },
    { sender: "Priya", content: "Can you tell us more about your target audience?" },
    { sender: "John Doe", content: "Professionals aged 25-40, urban, tech-savvy." },
    { sender: "Ravi", content: "We suggest a mix of short-form videos and carousel banners." },
    { sender: "Anita", content: "We'll set up a dashboard to track engagement and conversions in real-time." },
    { sender: "Rahul", content: "We can complement paid ads with organic content for consistent presence." },
    { sender: "John Doe", content: "How will you track ROI for the campaign?" },
    { sender: "Anita", content: "We'll track conversions, engagement rate, and cost per acquisition." },
    { sender: "Priya", content: "Segmenting campaigns by audience clusters can boost engagement by 15-20%." },
    { sender: "Ravi", content: "User-generated content like testimonials can increase trust." },
    { sender: "John Doe", content: "How quickly can you start implementing these strategies?" },
    { sender: "Rahul", content: "We can begin this week and go live within two weeks." },
    { sender: "Priya", content: "We'll share a detailed campaign timeline tomorrow." },
    { sender: "Ravi", content: "We'll also send initial creative mockups for feedback." },
    { sender: "Anita", content: "Weekly check-ins will review performance metrics." },
    { sender: "John Doe", content: "Sounds excellent. Thanks, team!" },
    { sender: "Rahul", content: "Thank you, John. We'll get started right away." },
];

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Client Backend Dashboard</h1>

            <div className="max-w-3xl mx-auto p-6 bg-muted text-foreground rounded-lg shadow-md">
                <div className="h-fit w-full flex items-center justify-between mb-2 py-2 px-6 rounded-xl shadow bg-background dark:bg-input">
                    <div className="flex max-md:flex-col max-md:items-start items-center justify-normal max-md:gap-0.5 gap-4 py-1">
                        <h2 className="text-2xl max-md:text-xl font-bold">
                            {participants[4].name}
                        </h2>

                        <h3 className="px-3 max-md:px-2 py-0.5 text-xs text-background rounded-xl bg-chart-4">
                            {participants[4].role}
                        </h3>
                    </div>
                    <DevModeToggle />
                </div>

                <div className="mb-4 flex flex-col items-start justify-center gap-3">
                    <h3 className="w-full font-semibold text-center">Participants</h3>
                    <div className="w-full h-fit flex items-center justify-center max-md:justify-between gap-3 max-md:gap-0">
                        {participants.map((p, idx) => (
                            <div
                                key={idx}
                                className={`px-3 max-md:px-2 py-1 text-xs text-background rounded-xl ${p.role.toLowerCase().startsWith("founder") ? "bg-chart-5" : "bg-chart-3"
                                    }`}
                            >
                                {(p.name.length > 8) ? p.name.slice(0, 8) + "..." : p.name}
                            </div>
                        ))}
                    </div>

                    <div className="max-w-md flex items-center gap-3">
                        <span className="flex items-center-safe gap-1">
                            <span className="w-3 h-3 rounded-xs bg-chart-5 inline-block"></span>
                            <span className="text-sm">Founder</span>
                        </span>
                        <span className="flex items-center-safe gap-1">
                            <span className="w-3 h-3 rounded-xs bg-chart-3 inline-block"></span>
                            <span className="text-sm">Client</span>
                        </span>
                    </div>

                </div>

                <div className="mb-4">
                    <h3 className="font-semibold text-center mb-2">Transcript</h3>
                    <div className=" py-4 space-y-3 max-h-80 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-muted scrollbar-track-gray-200">
                        {transcript.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-md shadow-sm ${msg.sender === "John Doe"
                                    ? "bg-chart-2/40 text-foreground"
                                    : "bg-input text-foreground"
                                    }`}
                            >
                                <span className="font-semibold">{msg.sender}:</span>{" "}
                                <span>{msg.content}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage
