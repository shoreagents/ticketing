"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CustomSelect } from '@/components/ui/custom-select'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function FormPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'General'
  const [userData, setUserData] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserData = localStorage.getItem('userData');
    
    if (!isAuthenticated || !storedUserData) {
      // Redirect to login page
      window.location.href = '/login';
      return;
    }
    
    setUserData(JSON.parse(storedUserData));
  }, [])

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDropdown && !target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const concern = formData.get('concern') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!concern || !category) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Create FormData for file upload
      const uploadData = new FormData()
      uploadData.append('concern', concern)
      uploadData.append('category', category)
      uploadData.append('description', description || '')

      // Get files from the selected files state
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          uploadData.append('files', file)
        })
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
        toast.custom((t) => (
          <div className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-900">Ticket submitted successfully!</span>
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-[16px]">Success</span>
            </div>
          </div>
        ))
        // Clear selected files
        setSelectedFiles([])
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        toast.error(data.error || 'Failed to submit ticket')
      }
    } catch (error) {
      console.error('Submit ticket error:', error)
      toast.error('Failed to submit ticket. Please try again.')
    }
  }

  const handleLogout = () => {
    // Clear user data and redirect to login
    setUserData(null);
    setShowDropdown(false);
    window.location.href = '/login';
  };

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

  const getDescription = (category: string) => {
    switch (category) {
      case 'IT':
        return "Fill out the form below to submit your IT support request."
      case 'Finance':
        return "Fill out the form below to submit your finance-related request."
      case 'Admin':
        return "Fill out the form below to submit your administrative request."
      case 'Transport':
        return "Fill out the form below to submit your transportation request."
      case 'Maintenance':
        return "Fill out the form below to submit your maintenance request."
      case 'Others':
        return "Fill out the form below to submit your general request."
      default:
        return "Fill out the form below to submit your request."
    }
  }

  return (
    <>
      <link 
        href="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/css/aditivo-new-site.shared.94914ecb4.min.css" 
        rel="stylesheet" 
        type="text/css"
      />
      <div className="page-wrapper navbar-on-page">
        <main className="main-wrapper">
          <header className="section_header23">
            {/* User Info outside Hero */}
            {userData && (
              <div className="padding-global mt-4 sm:mt-10">
                <div>
                  <div className="flex justify-end mb-4 px-4 sm:px-0">
                    <div className="relative user-dropdown">
                      <div 
                        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 border border-gray-200 cursor-pointer hover:bg-white/90 transition-colors"
                        style={{ borderRadius: '16px' }}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {userData.first_name} {userData.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {userData.employee_id}
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {userData.first_name?.charAt(0)}{userData.last_name?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-200 z-50"
                          >
                            <div className="py-1">
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 flex items-center gap-2 hover:!text-red-500 transition-colors"
                              >
                                <svg className="w-4 h-4 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Section */}
            <div className="padding-global mt-16">
              <div className="container-large">
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                    {/* Text Section - First Column */}
                    <div className="flex flex-col justify-start">
                      {/* Back to Home Button */}
                      <div className="mb-6">
                        <Button 
                          onClick={() => window.location.href = '/'}
                          className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-4 sm:!px-6 !py-2 sm:!py-3 !font-medium hover:!bg-black hover:!text-white font-sans group text-sm sm:text-base"
                        >
                          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                          Back to Home
                        </Button>
                      </div>
                      
                      {/* Title and Description */}
                      <div className="mb-8">
                        <div className="mb-2">
                          <h1 className="heading-style-h1">Submit Your Request</h1>
                        </div>
                        <p className="text-size-xlarge">Tell us what you need help with and we'll assist you right away.</p>
                      </div>
                    </div>
                    
                    {/* Form Section - Second Column */}
                    <div className="flex justify-center">
                      <div className="form-container bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 sm:p-6 lg:p-8 w-full">
                        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                          <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="concern" className="text-sm sm:text-base">Concern*</Label>
                            <Input
                              id="concern"
                              name="concern"
                              placeholder="Briefly describe your issue or request"
                              required
                              className="text-sm sm:text-base"
                            />
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="category" className="text-sm sm:text-base">What is your support ticket related to?*</Label>
                            <CustomSelect
                              name="category"
                              required
                              placeholder="Select an option"
                              options={[
                                { value: "Computer & Equipment", label: "Computer & Equipment" },
                                { value: "Network & Internet", label: "Network & Internet" },
                                { value: "Station", label: "Station" },
                                { value: "Surroundings", label: "Surroundings" },
                                { value: "Schedule", label: "Schedule" },
                                { value: "Compensation", label: "Compensation" },
                                { value: "Transport", label: "Transport" },
                                { value: "Suggestion", label: "Suggestion" },
                                { value: "Check-in", label: "Check-in" }
                              ]}
                            />
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="description" className="text-sm sm:text-base">Additional Details (Optional)</Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Please provide any additional information, specific details, or context that will help us better understand and resolve your request..."
                              className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                            />
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="supportingInfo" className="text-sm sm:text-base">Supporting Information (Optional)</Label>
                            <label 
                              htmlFor="supportingInfo" 
                              className={`relative flex items-center justify-center w-full h-20 sm:h-24 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                                isDragOver 
                                  ? 'border-blue-400 bg-blue-50' 
                                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                                <p className="text-xs sm:text-sm text-gray-500">
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
                                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <span className="text-xs text-gray-700 truncate">{file.name}</span>
                                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-center pt-2">
                            <Button 
                              type="submit"
                              className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-4 sm:!px-6 !py-2 sm:!py-3 !font-medium hover:!bg-black hover:!text-white font-sans group text-sm sm:text-base"
                            >
                              Submit Ticket
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </main>
      </div>
    </>
  )
} 