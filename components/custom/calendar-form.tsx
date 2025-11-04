"use client"

import * as React from "react"
import { Clock2Icon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarFormProps {
  value?: {
    date?: Date
    startTime?: string
    endTime?: string
  }
  onChange?: (value: { date?: Date; startTime?: string; endTime?: string }) => void
}

export function CalendarForm({ value, onChange }: CalendarFormProps) {
  const today = new Date()

  const allowedDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
  ]

  const disableDays = (date: Date) => {
    return !allowedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    )
  }

  const timeSlot: Record<string, string> = {
    "11:00:00": "13:00:00",
    "14:00:00": "16:00:00",
    "17:00:00": "19:00:00",
  }

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value?.date ?? allowedDates[0]
  )
  const [selectedStart, setSelectedStart] = React.useState<string>(
    value?.startTime ?? "11:00:00"
  )
  const [selectedEnd, setSelectedEnd] = React.useState<string>(
    value?.endTime ?? timeSlot["11:00:00"]
  )

  React.useEffect(() => {
    onChange?.({ date: selectedDate, startTime: selectedStart, endTime: selectedEnd })
  }, [selectedDate, selectedStart, selectedEnd, onChange])

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disableDays}
          className="bg-transparent p-0"
        />
      </CardContent>

      <CardFooter className="flex flex-col gap-6 border-t px-4 pt-4!">
        <div className="flex w-full flex-col gap-3">
          <Label>Start Time</Label>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground absolute left-2.5 size-4" />
            <Select
              value={selectedStart}
              onValueChange={(val) => {
                setSelectedStart(val)
                setSelectedEnd(timeSlot[val])
              }}
            >
              <SelectTrigger className="w-full pl-8">
                <SelectValue placeholder="Select start slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Start Time Slot</SelectLabel>
                  {Object.keys(timeSlot).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Label>End Time</Label>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground absolute left-2.5 size-4" />
            <Input
              type="time"
              step="1"
              disabled
              value={selectedEnd}
              className="appearance-none pl-8"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
