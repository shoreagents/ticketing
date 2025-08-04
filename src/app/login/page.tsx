"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('')

  const showErrorToast = (message: string) => {
    toast.custom((t) => (
      <div className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">{message}</span>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-[16px]">Error</span>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!employeeId) {
      showErrorToast('Please enter your Employee ID')
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user data in localStorage
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        // Redirect to home page
        window.location.href = '/'
      } else {
        showErrorToast(data.error || 'Invalid Employee ID')
      }
    } catch (error) {
      console.error('Login error:', error)
      showErrorToast('Login failed. Please try again.')
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
            <div className="padding-global">
              <div className="container-large">
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-align-center">
                    <div className="align-center">
                      <div className="mb-2">
                        <h1 className="heading-style-h1">Need <span style={{color: 'rgb(48 134 64)'}}>support</span>? We&apos;ve got <span style={{color: 'rgb(48 134 64)'}}>you</span>.</h1>
                      </div>
                      <p className="text-size-xlarge margin-bottom margin-medium">Your all-in-one ticketing system for workplace needs.</p>
                      
                      {/* Login Form Section - Centered */}
                      <div className="flex items-center justify-center mt-8">
                        <div className="w-full max-w-md">
                          <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="flex gap-3">
                              <div className="relative flex-1">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="employeeId"
                                  name="employeeId"
                                  type="text"
                                  placeholder="Employee ID"
                                  value={employeeId}
                                  onChange={(e) => setEmployeeId(e.target.value)}
                                  className="pl-10 w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                  required
                                />
                              </div>
                              <Button
                                type="submit"
                                className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-6 !py-3 !font-medium hover:!bg-black hover:!text-white font-sans group whitespace-nowrap"
                              >
                                Sign In
                              </Button>
                            </div>
                          </form>
                        </div>
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