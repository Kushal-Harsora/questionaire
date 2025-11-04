'use client';

// System Components Import
import z from 'zod';
import React from "react";
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { useEmail } from "@/hooks/userDetails"
import { zodResolver } from "@hookform/resolvers/zod"

// UI Components Import
import { CalendarForm } from "@/components/custom/calendar-form"
import { DevModeToggle } from "@/components/custom/dev-toggle-theme"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"


// Form Schema
const formSchema = z.object({
    name: z.string()
        .min(1, "Name must be at least 8 characters."),
    email: z.email(),
    phone: z.string()
        .refine((value) => value.length === 10,
            "Phone number must be of 10 characters."),
    timeSlot: z.object({
        date: z.date(),
        startTime: z.string(),
        endTime: z.string(),
    }),
    remark: z.string()
        .min(1, "Remark must be at least 1 characters.")
        .max(100, "Remark must be at most 100 characters."),

});


export default function Form() {

    // Custom Hook
    const { userEmail } = useEmail();

    // States
    const [loading, setLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: userEmail,
            phone: "",
            remark: ""
        },
    });


    React.useEffect(() => {
        if (userEmail) {
            form.setValue("email", userEmail);
        }
    }, [form, userEmail]);


    // Navigation Handler
    const router = useRouter();

    // Handle Submit
    async function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true);

        try {
            const response: AxiosResponse = await axios.post("/api/form", values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (response.status === 200) {
                toast.success(data.message || "Form Submitted!");
                router.push("/");
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
            console.log(values);
            setLoading(false);
            form.reset();
        }
    }

    return (
        <main className="h-screen w-screen pt-8 flex flex-col items-center justify-normal">
            <div className="w-full max-w-md max-md:w-4/5">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <div className=" w-full h-fit flex items-center justify-between">
                                <h1 className="w-fit text-2xl max-md:text-xl">
                                    Inquiry Form
                                </h1>
                                <div className="w-fit">
                                    <DevModeToggle />
                                </div>
                            </div>
                            <FieldGroup className="gap-4 max-md:gap-3">
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="John Doe"
                                                className="max-md:text-xs"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input
                                                {...field}
                                                type="email"
                                                id="email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="someone@example.com"
                                                className="max-md:text-xs"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="phone"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                id="phone"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="+91-999-999-9999"
                                                className="max-md:text-xs"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="timeSlot"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Field className="max-md:gap-1.5">
                                            <FieldLabel>Select Time Slot</FieldLabel>
                                            <Dialog>
                                                <DialogTrigger className="w-full h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                                                    {field.value?.date
                                                        ? `${field.value.date.toLocaleDateString()} (${field.value.startTime} - ${field.value.endTime})`
                                                        : "Select Time Slot"}
                                                </DialogTrigger>
                                                <DialogContent className="w-fit flex flex-col items-center justify-center">
                                                    <DialogHeader>
                                                        <DialogTitle>Select Time Slot</DialogTitle>
                                                    </DialogHeader>

                                                    <CalendarForm value={field.value} onChange={field.onChange} />

                                                    <DialogFooter className="w-full grid grid-cols-2 mt-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline" type="button">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button type="button">Save</Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="remark"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="max-md:gap-1.5" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="remark">
                                                Remark
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="remark"
                                                    placeholder="I'd like to discuss strategies to improve my current marketing ROI and explore new campaign ideas."
                                                    rows={6}
                                                    className="min-h-24 resize-none max-md:text-xs"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <InputGroupAddon align="block-end">
                                                    <InputGroupText className="tabular-nums max-md:text-xs">
                                                        {field.value.length}/100 characters
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldDescription className="max-md:text-xs">
                                                Include all the things in your mind so we can generate
                                                helpful insights for your business
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>
                        <Field orientation="horizontal" className="w-full grid grid-cols-2 items-center justify-center">
                            <Button onClick={() => form.reset()} className="max-md:text-xs" variant="outline" type="button">
                                Cancel
                            </Button>
                            <Button className="max-md:text-xs" type="submit">{loading ? <span className=" w-full h-full flex items-center justify-center gap-1.5"><Spinner /> Submitting</span> : "Submit"}</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </main>
    )
}
