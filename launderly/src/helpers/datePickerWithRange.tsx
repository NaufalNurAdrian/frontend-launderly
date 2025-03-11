"use client"
import React, { useState, useEffect, useRef } from "react"
import { format, isValid } from "date-fns"
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
  const [isOpen, setIsOpen] = useState(false)
  
  // Use ref to track submitting state and avoid extra renders
  const isSubmittingRef = useRef(false)
  
  // Use ref to track previous values for comparison
  const prevValueRef = useRef<DateRange | undefined>(value)

  // Sync with parent component's value when it changes externally
  useEffect(() => {
    // Only update if the parent value changed and it's different from our current state
    if (value !== prevValueRef.current && 
        JSON.stringify(value) !== JSON.stringify(date) && 
        !isSubmittingRef.current) {
      setDate(value)
      prevValueRef.current = value
    }
  }, [value, date])

  // Handle date selection changes
  const handleDateChange = (selectedDate: DateRange | undefined) => {
    console.log("Date picker selection changed:", selectedDate)
    setDate(selectedDate)
  }

  // Handle applying a selected date range
  const applyDateRange = () => {
    if (date?.from && date?.to && onChange) {
      console.log("Applying date range:", date)
      isSubmittingRef.current = true
      
      const formattedFrom = new Date(date.from)
      formattedFrom.setHours(0, 0, 0, 0)
      
      const formattedTo = new Date(date.to)
      formattedTo.setHours(23, 59, 59, 999)
      
      onChange({
        from: formattedFrom,
        to: formattedTo
      })
      
      // Reset the submitting flag after the parent has processed the change
      setTimeout(() => {
        isSubmittingRef.current = false
        prevValueRef.current = date
      }, 0)
    }
    
    setIsOpen(false)
  }
  
  // Handle clearing the date range
  const clearDateRange = () => {
    setDate(undefined)
    
    if (onChange) {
      isSubmittingRef.current = true
      onChange(undefined)
      
      // Reset the submitting flag after the parent has processed the change
      setTimeout(() => {
        isSubmittingRef.current = false
        prevValueRef.current = undefined
      }, 0)
    }
    
    setIsOpen(false)
  }

  // Handle popover open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    
    // When closing without applying, reset to the last confirmed value
    if (!open && !isSubmittingRef.current) {
      setDate(prevValueRef.current)
    }
  }

  return (
    <div className={`grid gap-2 ${className || ''}`}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`
              w-full
              justify-start 
              text-left 
              font-normal 
              bg-white
              text-gray-700
              border-gray-200
              hover:bg-gray-50
              hover:text-gray-900
              hover:border-gray-300
              ${!date ? 'text-gray-500' : ''} 
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
            disabled={disabled}
          />
          <div className="flex justify-end gap-2 p-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={clearDateRange}
              className="text-xs"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={applyDateRange}
              className="text-xs"
              disabled={!date?.from || !date?.to}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
