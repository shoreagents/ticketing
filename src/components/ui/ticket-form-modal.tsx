"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CustomSelect } from '@/components/ui/custom-select'
import { ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface TicketFormModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {id: number, first_name: string, last_name: string, employee_id: string} | null
}

export default function TicketFormModal({ isOpen, onClose, userData }: TicketFormModalProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form validation state
  const [formData, setFormData] = useState({
    concern: '',
    category: '',
    description: ''
  })
  const [isFormValid, setIsFormValid] = useState(false)

  // Check if form is valid whenever formData changes
  useEffect(() => {
    const isValid = formData.concern.trim() !== '' && formData.category.trim() !== ''
    setIsFormValid(isValid)
  }, [formData])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.categories)
        } else {
          console.error('Failed to fetch categories:', data.error)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const concern = formData.get('concern') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!concern || !category) {
      toast.error('Please fill in all required fields (Concern and Category)')
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('concern', concern)
      uploadData.append('category', category)
      uploadData.append('description', description || '')

      // Get files from the selected files state
      if (selectedFiles.length > 0) {
        console.log('Sending files:', selectedFiles.length)
        console.log('File names:', selectedFiles.map(f => f.name))
        selectedFiles.forEach(file => {
          uploadData.append('files', file)
        })
      } else {
        console.log('No files to send')
      }

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'user-data': JSON.stringify(userData)
        },
        body: uploadData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.custom(() => (
          <div className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">Ticket submitted successfully!</span>
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-[16px]">Success</span>
            </div>
          </div>
        ))
        // Clear selected files and form
        setSelectedFiles([])
        setFormData({ concern: '', category: '', description: '' })
        // Close modal
        onClose()
      } else {
        toast.error(data.error || 'Failed to submit ticket')
      }
    } catch (error) {
      console.error('Submit ticket error:', error)
      toast.error('Failed to submit ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const validTypes = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension);
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Submit Your Request</h2>
                  <p className="text-sm text-gray-600 mt-1">Tell us what you need help with</p>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="concern" className="text-sm">
                      Concern <span className="text-gray-600">(Required)</span>
                    </Label>
                    <Input
                      id="concern"
                      name="concern"
                      placeholder="Briefly describe your issue or request"
                      required
                      value={formData.concern}
                      onChange={(e) => handleInputChange('concern', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">
                      What is your support ticket related to? <span className="text-gray-600">(Required)</span>
                    </Label>
                    <CustomSelect
                      name="category"
                      required
                      placeholder="Select An Option"
                      onChange={(value) => handleInputChange('category', value)}
                      options={categories.map(category => ({
                        value: category.name,
                        label: category.name
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">
                      Additional Details <span className="text-gray-600">(Optional)</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please provide any additional information, specific details, or context that will help us better understand and resolve your request..."
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportingInfo" className="text-sm">
                      Supporting Information <span className="text-gray-600">(Optional)</span>
                    </Label>
                    <label 
                      htmlFor="supportingInfo" 
                      className={`relative flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                        isDragOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                        <p className="text-xs text-gray-500">
                          {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF, DOC up to 10MB</p>
                      </div>
                      <input 
                        id="supportingInfo" 
                        name="supportingInfo" 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        multiple 
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" 
                        onChange={handleFileSelect}
                      />
                    </label>
                    
                    {/* Selected Files Display */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2 min-w-0">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              <span className="text-xs text-gray-700 truncate min-w-0 flex-1">{file.name}</span>
                              <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 text-xs flex-shrink-0 ml-2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit"
                      disabled={isSubmitting || !isFormValid}
                      className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-6 !py-3 !font-medium hover:!bg-black hover:!text-white font-sans group text-sm disabled:!opacity-50 disabled:!cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Ticket
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 