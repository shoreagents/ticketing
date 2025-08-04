"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ArrowUp, ArrowDown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { CustomSelect } from '@/components/ui/custom-select'

interface Ticket {
  id: number
  ticket_id: string
  concern: string
  details?: string
  status: string
  created_at: string
  resolved_at?: string
  resolved_by?: string
  category_name?: string
  file_count?: number
}

interface TicketHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {id: number, first_name: string, last_name: string, employee_id: string} | null
}

export default function TicketHistoryModal({ isOpen, onClose, userData }: TicketHistoryModalProps) {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (isOpen && userData) {
      fetchUserTickets(userData)
      fetchCategories()
    }
  }, [isOpen, userData])

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
    }
  }

  const fetchUserTickets = async (userData: { id: number; first_name: string; last_name: string; employee_id: string }) => {
    try {
      setLoading(true)
      console.log('Fetching tickets for user:', userData.id)
      
      const response = await fetch('/api/tickets/user', {
        headers: {
          'user-data': JSON.stringify(userData)
        }
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Tickets data:', data)
        
        if (data.success) {
          setTickets(data.tickets)
          console.log('Set tickets:', data.tickets.length)
        } else {
          console.error('Failed to fetch tickets:', data.error)
          toast.error('Failed to fetch tickets')
        }
      } else {
        console.error('Failed to fetch tickets - status:', response.status)
        toast.error('Failed to fetch tickets')
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Error fetching tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getFilteredAndSortedTickets = () => {
    // First filter the tickets
    const filteredTickets = tickets.filter((ticket) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        ticket.ticket_id.toLowerCase().includes(searchLower) ||
        ticket.concern.toLowerCase().includes(searchLower) ||
        (ticket.details && ticket.details.toLowerCase().includes(searchLower)) ||
        (ticket.category_name && ticket.category_name.toLowerCase().includes(searchLower))

      // Category filter
      const matchesCategory = selectedCategory === 'all' || ticket.category_name === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Then sort the filtered tickets
    return filteredTickets.sort((a, b) => {
      let aValue: string | number | Date = a[sortField as keyof Ticket]
      let bValue: string | number | Date = b[sortField as keyof Ticket]

      // Handle date fields
      if (sortField === 'created_at' || sortField === 'resolved_at') {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Ticket History</h2>
                  <p className="text-sm text-gray-600 mt-1">View and track all your support tickets</p>
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

              {/* Content */}
              <div className="p-6">
                {/* Search and Filter Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search tickets..."
                        className="pl-10 text-sm !bg-white !border-gray-200 !text-black placeholder:!text-gray-500 hover:!border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CustomSelect
                      name="category-filter"
                      placeholder="Filter By Category"
                      onChange={(value) => setSelectedCategory(value)}
                      className="!bg-white !border-gray-200 !text-black placeholder:!text-gray-500 hover:!border-gray-300 !w-48 !min-w-48"
                      options={[
                        { value: "all", label: "All Categories" },
                        ...categories.map(category => ({
                          value: category.name,
                          label: category.name
                        }))
                      ]}
                    />
                  </div>
                </div>

                {/* Tickets Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="w-[150px] cursor-pointer hover:bg-gray-50 !px-4 !py-3"
                          onClick={() => handleSort('ticket_id')}
                        >
                          <div className="flex items-center gap-1">
                            Ticket ID
                            {sortField === 'ticket_id' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="w-3 h-3 text-gray-600 transition-all" /> : 
                                <ArrowDown className="w-3 h-3 text-gray-600 transition-all" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 w-[200px] !px-4 !py-3"
                          onClick={() => handleSort('category_name')}
                        >
                          <div className="flex items-center gap-1">
                            Category
                            {sortField === 'category_name' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="w-3 h-3 text-gray-600 transition-all" /> : 
                                <ArrowDown className="w-3 h-3 text-gray-600 transition-all" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 w-[300px] !px-4 !py-3"
                          onClick={() => handleSort('concern')}
                        >
                          <div className="flex items-center gap-1">
                            Concern
                            {sortField === 'concern' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="w-3 h-3 text-gray-600 transition-all" /> : 
                                <ArrowDown className="w-3 h-3 text-gray-600 transition-all" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50 w-[400px] !px-4 !py-3"
                          onClick={() => handleSort('details')}
                        >
                          <div className="flex items-center gap-1">
                            Additional Details
                            {sortField === 'details' && (
                              sortDirection === 'asc' ? 
                                <ArrowUp className="w-3 h-3 text-gray-600 transition-all" /> : 
                                <ArrowDown className="w-3 h-3 text-gray-600 transition-all" />
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <>
                          {[...Array(5)].map((_, index) => (
                            <TableRow key={index} className="!py-2">
                              <TableCell className="!px-4 !py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              </TableCell>
                              <TableCell className="!px-4 !py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                              </TableCell>
                              <TableCell className="!px-4 !py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                              </TableCell>
                              <TableCell className="!px-4 !py-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : getFilteredAndSortedTickets().length === 0 ? (
                        <TableRow className="!py-2">
                          <TableCell colSpan={4} className="text-center !py-8 !px-4 text-gray-500">
                            No Tickets Found
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredAndSortedTickets().map((ticket: Ticket) => (
                          <TableRow key={ticket.id} className="!py-2">
                            <TableCell className="font-medium !px-4 !py-3 text-gray-900">{ticket.ticket_id}</TableCell>
                            <TableCell className="!px-4 !py-3 text-gray-900">{ticket.category_name || 'N/A'}</TableCell>
                            <TableCell className="max-w-[300px] truncate !px-4 !py-3 text-gray-900" title={ticket.concern}>
                              {ticket.concern}
                            </TableCell>
                            <TableCell className="text-sm !px-4 !py-3 text-gray-900">
                              {ticket.details ? (
                                <div className="max-w-[400px] truncate text-gray-900" title={ticket.details}>
                                  {ticket.details}
                                </div>
                              ) : (
                                <span className="text-gray-500">No additional details</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 