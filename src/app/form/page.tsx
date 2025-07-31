"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function FormPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'General'
  const [formData, setFormData] = useState({
    concern: '',
    details: '',
    priority: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const storedUserData = localStorage.getItem('userData')
    
    if (!isAuthenticated || !storedUserData) {
      window.location.href = '/login'
      return
    }
    
    setUserData(JSON.parse(storedUserData))
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userData) {
      alert('Please log in to submit a ticket')
      return
    }

    if (!formData.concern || !formData.priority) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id,
          concern: formData.concern,
          details: formData.details,
          category: category
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Ticket submitted successfully!')
        window.location.href = '/'
      } else {
        alert(data.error || 'Failed to submit ticket')
      }
    } catch (error) {
      console.error('Submit ticket error:', error)
      alert('Failed to submit ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
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
          <header>
            <div className="padding-global">
              <div className="container-small">
                <div className="py-16 px-4">
                  <div className="text-align-center">
                    <div className="align-center">
                      <div className="margin-top margin-xxlarge">
                        <div className="margin-bottom margin-small">
                          <h1 className="heading-style-h1">Create <span style={{color: 'rgb(48 134 64)'}}>{category}</span> Ticket</h1>
                        </div>
                      </div>
                      <p className="text-size-xlarge">{getDescription(category)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Form Section */}
          <section>
            <div className="padding-global">
              <div className="container-small">
                <div>
                  <div className="max-width-large align-center">
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-16">
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="concern">Concern</Label>
                          <Input
                            id="concern"
                            name="concern"
                            placeholder="What is your support ticket related to?"
                            value={formData.concern}
                            onChange={(e) => setFormData({...formData, concern: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority Level</Label>
                          <Select 
                            name="priority" 
                            required
                            value={formData.priority}
                            onValueChange={(value) => setFormData({...formData, priority: value})}
                          >
                            <SelectTrigger className="w-full border border-gray-300 bg-gray-50 !bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-1 focus:ring-gray-400" style={{backgroundColor: '#f9fafb'}}>
                              <SelectValue placeholder="Select priority level*" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low - General inquiry</SelectItem>
                              <SelectItem value="medium">Medium - Standard request</SelectItem>
                              <SelectItem value="high">High - Urgent issue</SelectItem>
                              <SelectItem value="critical">Critical - System down</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Explain in more detail if needed</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Please provide detailed information about your request..."
                            className="min-h-[120px]"
                            value={formData.details}
                            onChange={(e) => setFormData({...formData, details: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="supportingInfo">Supporting Information</Label>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="supportingInfo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 10MB</p>
                              </div>
                              <input id="supportingInfo" name="supportingInfo" type="file" className="hidden" multiple accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" />
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6">
                          <Button 
                            type="button"
                            onClick={() => window.location.href = '/'}
                            className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-6 !py-3 !font-medium hover:!bg-black hover:!text-white font-sans group"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Back to Home
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-6 !py-3 !font-medium hover:!bg-black hover:!text-white font-sans group disabled:opacity-50"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
} 