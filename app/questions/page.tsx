'use client';

// System Components Import
import React from 'react';
import axios, { AxiosResponse } from 'axios';

// UI Components Import
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

// Icon Imports
import { Lightbulb } from 'lucide-react';


const Page = () => {
    const [count, setCount] = React.useState<number>(0);
    const [selected, setSelected] = React.useState<string | null>(null);
    const [selectedAnswers, setSelectedAnswers] = React.useState<
        { question: string; answer: string }[]
    >([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [showResults, setShowResults] = React.useState<boolean>(false);

    // ✅ Sample Questions for Marketing
    const sampleQuestions = [
        [
            {
                question: 'What is the primary goal of your current marketing efforts?',
                hint: 'Think about what success looks like for your brand right now. Are you focusing on being known, increasing revenue, keeping existing customers happy, or expanding into new areas?',
                options: [
                    'Increase brand awareness',
                    'Generate more leads or sales',
                    'Build customer loyalty and retention',
                    'Enter new markets or launch new products',
                ],
            },
        ],
        [
            {
                question: `How would you describe your brand's current positioning in the market?`,
                hint: 'Imagine how your target audience perceives your brand today. Are you known for luxury, affordability, innovation, or long-standing trust?',
                options: [
                    'Premium and exclusive',
                    'Affordable and value-driven',
                    'Innovative and modern',
                    'Traditional and trusted',
                ],
            },
        ],
        [
            {
                question: 'Which marketing channels do you primarily rely on right now?',
                hint: 'Consider where most of your marketing efforts and budget go. Which platforms or channels do you use most often to reach your customers?',
                options: [
                    'Social media (Instagram, Facebook, LinkedIn, etc.)',
                    'Paid ads (Google Ads, Meta Ads, etc.)',
                    'Organic SEO and content marketing',
                    'Offline marketing (events, print, partnerships, etc.)',
                ],
            },
        ],
        [
            {
                question: 'How consistent is your branding across all platforms (website, social, print, etc.)?',
                hint: 'Think about your logo, tone, colors, and messaging — do they look and feel the same across every touchpoint (online and offline)?',
                options: [
                    'Very consistent — we follow strict brand guidelines',
                    'Somewhat consistent — some variations exist',
                    'Not very consistent — needs improvement',
                    'No set branding strategy in place',
                ],
            },
        ],
        [
            {
                question: 'What is your current biggest marketing challenge?',
                hint: 'Reflect on where your team struggles most — is it getting noticed, converting customers, defining your brand, or managing limited funds?',
                options: [
                    'Low visibility or reach',
                    'Poor lead conversion or sales',
                    'Lack of clear brand identity',
                    'Limited marketing budget or resources',
                ],
            },
        ],
    ];

    const handleOptionClick = (option: string) => {
        setSelected(option);
    };

    const handleNext = () => {
        if (selected) {
            const currentQuestion = sampleQuestions[count][0].question;

            setSelectedAnswers((prev) => {
                const updated = [...prev];
                const existingIndex = updated.findIndex(
                    (a) => a.question === currentQuestion
                );

                if (existingIndex !== -1) {
                    updated[existingIndex] = { question: currentQuestion, answer: selected };
                } else {
                    updated.push({ question: currentQuestion, answer: selected });
                }

                return updated;
            });
        }

        if (count < sampleQuestions.length - 1) {
            setCount((prev) => prev + 1);
            const nextQuestion = sampleQuestions[count + 1][0].question;
            const existing = selectedAnswers.find((a) => a.question === nextQuestion);
            setSelected(existing ? existing.answer : null);
        } else {
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (count > 0) {
            setCount((prev) => prev - 1);
            const prevQuestion = sampleQuestions[count - 1][0].question;
            const existing = selectedAnswers.find((a) => a.question === prevQuestion);
            setSelected(existing ? existing.answer : null);
        }
    };

    const handleSubmit = async () => {

        setLoading(true);

        try {

            const response: AxiosResponse = await axios.post("/api/data", { data: selectedAnswers }, {
                headers: {
                    'Content-Type': 'Application/Json'
                }
            });
            
            const data = response.data;

            if (response.status === 200) {
                console.log(selectedAnswers);
                toast.success(data.message || "Submit Successful");

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;

                if (status === 500) {
                    toast.error(data.error || "Internal Server Error");
                }
            } else {
                toast.error("Some unknown error occured");
            }
        } finally {
            setLoading(false);
        }
    }

    if (showResults) {
        return (
            <main className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center">
                <h1 className="w-screen h-fit py-6 text-5xl font-medium max-md:text-3xl absolute top-0 left-0 text-center">
                    Your Answers
                </h1>

                <Card className="w-full h-full max-w-[70vw] max-md:max-w-[85vw] max-h-[75vh] mt-24 max-md:mt-6 text-lg max-md:text-base">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl max-md:text-lg">
                            Answer Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-6 py-4">
                        <div className=' w-full flex flex-col gap-4 px-6 py-4 max-h-[42.5vh] overflow-y-auto'>
                            {selectedAnswers.map((ans, index) => (
                                <div
                                    key={index}
                                    className="p-4 shadow rounded-md bg-muted"
                                >
                                    <h3 className="font-semibold mb-2">
                                        {index + 1}. {ans.question}
                                    </h3>
                                    <p className="text-chart-2">
                                        Your Answer:{' '}
                                        <span className="font-medium">{ans.answer}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-fit flex flex-row max-md:flex-col-reverse justify-center gap-2 items-center mt-6">
                            <Button
                                onClick={() => {
                                    setCount(0);
                                    setSelected(null);
                                    setSelectedAnswers([]);
                                    setShowResults(false);
                                }}
                                className='w-[200px] max-md:w-4/5'
                                variant={'outline'}
                            >
                                Restart Quiz
                            </Button>
                            <Button
                                className='w-[200px] max-md:w-4/5'
                                onClick={handleSubmit}
                            >
                                {loading ? <span className='w-full flex items-center justify-center gap-1'><Spinner />Submitting</span> : "Submit"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const currentQuestion = sampleQuestions[count][0];

    return (
        <main className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center">
            <h1 className="w-screen h-fit py-6 text-5xl font-medium max-md:text-3xl absolute top-0 left-0 text-center">
                Questionnaire
            </h1>

            <Card className="w-full h-full max-w-[70vw] max-md:max-w-[85vw] max-h-[75vh] mt-24 max-md:mt-6 text-lg max-md:text-base">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-center text-2xl max-md:text-lg w-full">
                        Question {count + 1} / {sampleQuestions.length}
                    </CardTitle>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                title="Show Hint"
                                className="ml-auto"
                            >
                                <Lightbulb className="h-5 w-5 text-amber-500" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-md:max-w-xs">
                            <DialogHeader>
                                <DialogTitle>💡 Hint</DialogTitle>
                            </DialogHeader>
                            <p className="text-base text-foreground mt-2">
                                {currentQuestion.hint}
                            </p>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent className="h-full w-full flex flex-col items-center justify-center gap-6">
                    {/* Question */}
                    <div className="h-[15vh] w-full flex items-center justify-center p-2 bg-amber-100 text-black text-base text-center rounded-lg">
                        {currentQuestion.question}
                    </div>

                    {/* Options */}
                    <div className="w-full flex flex-col gap-3 px-4">
                        {currentQuestion.options.map((option, idx) => (
                            <Button
                                key={idx}
                                onClick={() => handleOptionClick(option)}
                                variant={selected === option ? 'default' : 'outline'}
                                className="w-full h-auto py-3 max-md:py-2 whitespace-normal wrap-break-word text-wrap text-left"
                            >
                                {option}
                            </Button>
                        ))}
                    </div>


                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-4 max-md:mt-0">
                        <Button
                            onClick={handlePrevious}
                            disabled={count === 0}
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!selected}
                            variant="default"
                        >
                            {count === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};

export default Page
