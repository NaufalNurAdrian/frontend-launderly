"use client"
import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (range: { from: Date; to: Date } | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function DatePickerWithRange({
  value,
  onChange,
  disabled = false,
  className,
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>(value)

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate)
    if (onChange) {
      // Convert DateRange to { from: Date; to: Date } | undefined
      onChange(
        selectedDate && selectedDate.from && selectedDate.to 
          ? { from: selectedDate.from, to: selectedDate.to } 
          : undefined
      )
    }
  }

  return (
    <div className={`grid gap-2 ${className || ''}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`
              w-[300px] 
              justify-start 
              text-left 
              font-normal 
              ${!date ? 'text-muted-foreground' : ''} 
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}