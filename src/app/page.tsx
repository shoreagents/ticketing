"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CircleDollarSignIcon } from '@/components/ui/circle-dollar-sign'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'



function FileTicketCard() {
  return (
    <div 
      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer rounded-xl" 
      onClick={() => {
        window.location.href = '/form'
      }}
    >
      <div className="flex flex-col h-full">
        <div className="pd-right-medium text-left p-6 md:p-6">
          <h3 className="display-7 mid text-left text-base md:text-lg font-semibold">
            File a Ticket
          </h3>
          <div className="inner-container">
            <p className="mg-top-2x-extra-small text-sm md:text-base text-gray-600">Submit a new ticket for any workplace support or assistance.</p>
          </div>
        </div>
        <div className="inner-container _464px left---100-tablet mt-auto flex items-end justify-end w-full p-6 md:p-6">
          <div className="features-image-v2">
            <img 
              src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/floor-plans/public/ticketing/finance.png"
              alt="File a Ticket"
              className="w-auto h-32 md:h-50 object-contain inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [userData, setUserData] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [userTickets, setUserTickets] = useState<any[]>([])
  const [notificationEventSource, setNotificationEventSource] = useState<EventSource | null>(null)
  const [shownToastIds, setShownToastIds] = useState<Set<string>>(new Set())
  const initialLoadCompleted = useRef(false)
  const initialToastsShown = useRef(false)
  const lastUpdateTime = useRef(0)

  // Utility function for status colors
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'For Approval':
                    return 'bg-orange-100 text-orange-800';
                  case 'On Hold':
                    return 'bg-gray-100 text-gray-800';
                  case 'In Progress':
                    return 'bg-blue-100 text-blue-800';
                  case 'Approved':
                    return 'bg-indigo-100 text-indigo-800';
                  case 'Stuck':
                    return 'bg-red-100 text-red-800';
                  case 'Actioned':
                    return 'bg-purple-100 text-purple-800';
                  case 'Closed':
                    return 'bg-green-100 text-green-800';
                  default:
                    return 'bg-gray-100 text-gray-800';
                }
              };

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserData = localStorage.getItem('userData');
    
    if (!isAuthenticated || !storedUserData) {
      window.location.href = '/login';
      return;
    }
    setUserData(JSON.parse(storedUserData));

    // Fetch user tickets for toast notifications
    const fetchUserTickets = async () => {
      try {
        const response = await fetch('/api/tickets/user', {
                                      headers: {
            'user-data': JSON.stringify(JSON.parse(storedUserData))
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.tickets.length > 0) {
            setUserTickets(data.tickets);

            // Add existing tickets to shownToastIds to prevent duplicates
            const existingTicketIds = data.tickets.map((ticket: any) => `${ticket.ticket_id}-${ticket.status}`);
            setShownToastIds(prev => new Set([...prev, ...existingTicketIds]));
            
            // Check localStorage for dismissed toasts
            const dismissedToasts = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');

                        // Show only one toast for existing tickets (only once)
            if (!initialToastsShown.current) {
              initialToastsShown.current = true;
              // Show only the first non-dismissed ticket toast
              const nonDismissedTickets = data.tickets.filter((ticket: any) => {
                const toastKey = `${ticket.ticket_id}-${ticket.status}`;
                return !dismissedToasts.includes(toastKey);
              });
              
              if (nonDismissedTickets.length > 0) {
                const ticket = nonDismissedTickets[0];
                setTimeout(() => {
                  // Dismiss any existing toasts before showing new one
                  toast.dismiss();
                  toast.custom((t) => (
                    <div className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2">
                                              <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-base font-medium">{ticket.ticket_id}</span>
                          </div>
                        <div className="flex items-center gap-2">
                    {ticket.status === 'Closed' && (
                      <span 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                                // Save dismissed toast to localStorage
                                const toastKey = `${ticket.ticket_id}-${ticket.status}`;
                                const dismissedToasts = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');
                                if (!dismissedToasts.includes(toastKey)) {
                                  dismissedToasts.push(toastKey);
                                  localStorage.setItem('dismissedToasts', JSON.stringify(dismissedToasts));
                                }
                          toast.dismiss(t);
                        }}
                        className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        Thanks
                      </span>
                    )}
                    {ticket.status === 'For Approval' && (
                      <span 
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            const response = await fetch('/api/tickets/delete', {
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ ticketId: ticket.ticket_id })
                            });
                            if (response.ok) {
                              toast.dismiss(t);
                              setUserTickets(prev => prev.filter(t => t.ticket_id !== ticket.ticket_id));
                            }
                          } catch (error) {
                            console.error('Error deleting ticket:', error);
                          }
                        }}
                        className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        Cancel
                      </span>
                    )}
                    <span className={`px-3 py-1 text-sm font-medium rounded-[16px] ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'Closed' ? 'Completed' : ticket.status}
                    </span>
                        </div>
                  </div>
                </div>
              ));
                }, 1000);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user tickets:', error);
      }
    };

    fetchUserTickets();
    
    // Set up real-time notifications
    if (userData?.id) {
      const eventSource = new EventSource(`/api/notifications?userId=${userData.id}`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ticket_update') {
            // Debounce
            const now = Date.now();
            if (now - lastUpdateTime.current < 1000) {
              return;
            }
            lastUpdateTime.current = now;

            const currentTicketIds = new Set(userTickets.map((t: any) => t.ticket_id));
            const newTickets = data.tickets.filter((ticket: any) => !currentTicketIds.has(ticket.ticket_id));
            const statusUpdates = data.tickets.filter((ticket: any) => {
              const existingTicket = userTickets.find((t: any) => t.ticket_id === ticket.ticket_id);
              return existingTicket && existingTicket.status !== ticket.status;
            });

            if ((newTickets.length > 0 || statusUpdates.length > 0) && data.tickets.length > 0) {
              setUserTickets(data.tickets);

                            // Show only one toast for new tickets or status updates
              const ticketsToShow = [...newTickets, ...statusUpdates];
              if (ticketsToShow.length > 0) {
                const ticket = ticketsToShow[0]; // Show only the first ticket
                const toastKey = `${ticket.ticket_id}-${ticket.status}`;
                if (!shownToastIds.has(toastKey)) {
                  setShownToastIds(prev => new Set([...prev, toastKey]));
                  setTimeout(() => {
                    // Dismiss any existing toasts before showing new one
                    toast.dismiss();
                    toast.custom((t) => (
                      <div className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-base font-medium">{ticket.ticket_id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                        {ticket.status === 'Closed' && (
                          <span 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                                  // Save dismissed toast to localStorage
                                  const toastKey = `${ticket.ticket_id}-${ticket.status}`;
                                  const dismissedToasts = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');
                                  if (!dismissedToasts.includes(toastKey)) {
                                    dismissedToasts.push(toastKey);
                                    localStorage.setItem('dismissedToasts', JSON.stringify(dismissedToasts));
                                  }
                              toast.dismiss(t);
                            }}
                            className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
                          >
                            Thanks
                          </span>
                        )}
                        {ticket.status === 'For Approval' && (
                          <span 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              try {
                                const response = await fetch('/api/tickets/delete', {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ ticketId: ticket.ticket_id })
                                });
                                if (response.ok) {
                                  toast.dismiss(t);
                                  setUserTickets(prev => prev.filter(t => t.ticket_id !== ticket.ticket_id));
                                }
                              } catch (error) {
                                console.error('Error deleting ticket:', error);
                              }
                            }}
                                className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
                          >
                            Cancel
                          </span>
                        )}
                        <span className={`px-3 py-1 text-sm font-medium rounded-[16px] ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'Closed' ? 'Completed' : ticket.status}
                        </span>
                          </div>
                      </div>
                    </div>
                  ));
                  }, 100);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error parsing notification data:', error);
        }
      };
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
      };
      setNotificationEventSource(eventSource);
    }

    // Cleanup
    return () => {
      if (notificationEventSource) {
        notificationEventSource.close();
      }
    };
  }, [userData?.id]);

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
              <div className="padding-global px-4 sm:px-0">
                <div>
                  <div className="flex justify-end mb-4">
                    <div className="relative user-dropdown">
                      <div 
                        className="mt-4 sm:mt-10 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 border border-gray-200 cursor-pointer hover:bg-white/90 transition-colors"
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
                                onClick={() => {
                                  // Clear user data and redirect to login
                                  setUserData(null);
                                  setShowDropdown(false);
                                  window.location.href = '/login';
                                }}
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
            <div>
              <div>
                <div className="is-hero">
                  <div className="text-align-center">
                    <div className="align-center m-auto px-4 sm:px-0">
                      <div className="margin-top margin-medium">
                        <div className="mb-2">
                          <h1 className="heading-style-h1">Welcome, <span style={{color: 'rgb(48 134 64)'}}>{userData?.first_name || 'User'}</span>!</h1>
                        </div>
                      </div>
                      <p className="text-size-xlarge">Easily manage and track all your workplace support requests in one place.</p>
                      <div className="margin-top margin-medium">
                        <div className="button-group is-center">
                          
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Section - Moved inside hero */}
            <div className="margin-top margin-large">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto px-12 sm:px-6 md:px-8 mb-10">
                <div 
                  className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer rounded-xl" 
                  onClick={() => {
                    window.location.href = '/ticket-history'
                  }}
                >
                  <div className="flex flex-col h-full">
                    <div className="pd-right-medium text-left p-6 md:p-6">
                      <h3 className="display-7 mid text-left text-base md:text-lg font-semibold">
                        Ticket History
                      </h3>
                      <div className="inner-container">
                        <p className="mg-top-2x-extra-small text-sm md:text-base text-gray-600">View and manage your submitted tickets and their status.</p>
                      </div>
                    </div>
                    <div className="inner-container _464px left---100-tablet mt-auto flex items-end justify-end w-full p-6 md:p-6">
                      <div className="features-image-v2">
                        <img 
                          src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/floor-plans/public/ticketing/finance.png"
                          alt="IT Support"
                          className="w-auto h-32 md:h-50 object-contain inline"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <FileTicketCard />
              </div>
            </div>

          </header>
        </main>
      </div>
    </>
  )
}
