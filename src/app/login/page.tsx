"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, User } from 'lucide-react'

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!employeeId) {
      alert('Please enter your Employee ID')
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
        alert(data.error || 'Invalid Employee ID')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
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
          <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              {/* Header */}
              <div className="text-align-center">
                <div className="max-width-medium align-center">
                  <div className="margin-top margin-xxlarge">
                    <div className="margin-bottom margin-small">
                      <h1 className="heading-style-h1">Need <span style={{color: 'rgb(48 134 64)'}}>support</span>? We've got <span style={{color: 'rgb(48 134 64)'}}>you</span>.</h1>
                    </div>
                  </div>
                  <p className="text-size-xlarge">Your all-in-one ticketing system for workplace needs.</p>
                </div>
              </div>

              {/* Login Form */}
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
        </main>
      </div>
    </>
  )
} 