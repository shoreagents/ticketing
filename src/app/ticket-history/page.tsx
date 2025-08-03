"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CustomSelect } from '@/components/ui/custom-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, ArrowRight, Search, Filter, Eye, Calendar, Clock, User, ChevronUp, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

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

export default function TicketHistoryPage() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<{id: number, first_name: string, last_name: string, employee_id: string} | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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
    fetchUserTickets(JSON.parse(storedUserData));
    fetchCategories();
  }, [])

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
  };

  const fetchUserTickets = async (userData: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets/user', {
        headers: {
          'user-data': JSON.stringify(userData)
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter to only show closed tickets
          const closedTickets = data.tickets.filter((ticket: Ticket) => ticket.status === 'Closed');
          setTickets(closedTickets);
        } else {
          console.error('Failed to fetch tickets:', data.error);
          toast.error('Failed to fetch tickets');
        }
      } else {
        console.error('Failed to fetch tickets');
        toast.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogout = () => {
    // Clear user data and redirect to login
    setUserData(null);
    setShowDropdown(false);
    window.location.href = '/login';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'For Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      case 'Approved':
        return 'bg-indigo-100 text-indigo-800';
      case 'Stuck':
        return 'bg-red-100 text-red-800';
      case 'Actioned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFilteredAndSortedTickets = () => {
    // First filter the tickets
    let filteredTickets = tickets.filter((ticket) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        ticket.ticket_id.toLowerCase().includes(searchLower) ||
        ticket.concern.toLowerCase().includes(searchLower) ||
        (ticket.details && ticket.details.toLowerCase().includes(searchLower)) ||
        (ticket.category_name && ticket.category_name.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || ticket.category_name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Then sort the filtered tickets
    return filteredTickets.sort((a, b) => {
      let aValue: any = a[sortField as keyof Ticket];
      let bValue: any = b[sortField as keyof Ticket];

      // Handle date fields
      if (sortField === 'created_at' || sortField === 'resolved_at') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      // Handle string fields
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

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
            <div className="padding-global">
              <div className="container-large">
                <div>
                  {/* Title and Description - Same container as home page */}
                  <div>
                    <div>
                      <div className="is-hero">
                        <div className="text-align-center">
                          <div className="align-center m-auto px-4 sm:px-0">
                            <div className="margin-top margin-medium">
                              <div className="mb-2">
                                <h1 className="heading-style-h1">Ticket <span style={{color: 'rgb(48 134 64)'}}>History</span></h1>
                              </div>
                            </div>
                            <p className="text-size-xlarge">View and track all your completed support tickets and their resolution details.</p>
                            <div className="margin-top margin-medium">
                              <div className="button-group is-center">
                                {/* You can add buttons here if needed */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ticket History Section - Single Column */}
                  <div className="flex justify-center mt-8 mb-8">
                    <div className="form-container bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 sm:p-6 lg:p-8 w-full max-w-6xl">
                      {/* Search and Filter Section */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Search tickets..."
                              className="pl-10 text-sm sm:text-base !bg-white/80 !border-gray-200 !text-black placeholder:!text-gray-500 hover:!border-gray-300"
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
                              className="!bg-white/80 !border-gray-200 !text-black placeholder:!text-gray-500 hover:!border-gray-300 !w-48 !min-w-48"
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

                      {/* Bottom Navigation */}
                      <div className="flex items-center justify-start pt-6">
                        <Button 
                          type="button"
                          onClick={() => window.location.href = '/'}
                          className="ticket-button !bg-transparent !border-2 !border-black !text-black !rounded-full !px-4 sm:!px-6 !py-2 sm:!py-3 !font-medium hover:!bg-black hover:!text-white font-sans group text-sm sm:text-base"
                        >
                          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                          Back to Home
                        </Button>
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