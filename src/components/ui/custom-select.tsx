"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CustomSelectProps {
  name: string
  required?: boolean
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
  onChange?: (value: string) => void
}

export function CustomSelect({
  name,
  required = false,
  placeholder = "Select an option",
  options,
  className,
  onChange
}: CustomSelectProps) {
  const [selectedValue, setSelectedValue] = useState('')

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onChange?.(value)
  }

    return (
    <Select onValueChange={handleSelect} value={selectedValue}>
             <SelectTrigger 
                 className={cn(
          "w-full border-2 border-gray-300 bg-gray-50 text-gray-900 focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-2 cursor-pointer",
          className
        )}
                style={{ 
          backgroundColor: '#f9fafb',
          border: '2px solid rgb(209 213 219) !important',
          borderColor: 'rgb(209 213 219) !important'
        }}
        data-custom-placeholder="true"
       >
         <SelectValue placeholder={placeholder} />
       </SelectTrigger>
      
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
      
      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />
    </Select>
  )
} 