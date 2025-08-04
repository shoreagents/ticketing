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
  placeholder = "Select An Option",
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
          "w-full border-2 border-gray-200 bg-white text-gray-900 rounded-md px-3 py-2 cursor-pointer hover:border-gray-300 relative min-w-0",
          className
        )}
        data-custom-placeholder="true"
       >
         <SelectValue placeholder={placeholder} />
       </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={4}
        align="start"
        className="z-50 !fixed"
        side="bottom"
        avoidCollisions={true}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
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