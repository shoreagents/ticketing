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
            
            // Set up overlay functionality once
            const setupOverlay = () => {
              const sonnerContainer = document.querySelector('[data-sonner-toaster="true"]');
              if (sonnerContainer && !sonnerContainer.hasAttribute('data-overlay-setup')) {
                sonnerContainer.setAttribute('data-overlay-setup', 'true');
                
                sonnerContainer.addEventListener('mouseenter', () => {
                  // Check if overlay already exists
                  const existingOverlay = document.getElementById('toast-overlay');
                  if (existingOverlay) {
                    return; // Don't create another overlay
                  }
                  
                  const overlay = document.createElement('div');
                  overlay.className = 'fixed inset-0 z-40';
                  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                  overlay.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                  overlay.id = 'toast-overlay';
                  document.body.appendChild(overlay);
                  
                  // Trigger the transition after a brief delay
                  setTimeout(() => {
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                  }, 10);
                });
                
                sonnerContainer.addEventListener('mouseleave', () => {
                  const overlay = document.getElementById('toast-overlay');
                  if (overlay) {
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    setTimeout(() => {
                      overlay.remove();
                    }, 300);
                  }
                });
              }
            };
            
            // Set up overlay after toasts render
            setTimeout(setupOverlay, 100);
            
            // Show toasts for user tickets with delay (only for initial load)
            data.tickets.forEach((ticket: any, index: number) => {
              // Track shown toasts to prevent duplicates
              setShownToastIds(prev => new Set([...prev, ticket.ticket_id]))
              setTimeout(() => {
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

              toast.custom((t) => (
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.custom((expandedToast) => (
                      <div 
                        className="w-[28rem] bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base">{ticket.ticket_id}</span>
                          <div className="flex items-center gap-2 justify-start">
                            {ticket.status === 'Closed' && (
                              <span 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toast.dismiss(expandedToast);
                                }}
                                className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
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
                                      toast.dismiss(expandedToast);
                                      // Remove ticket from local state
                                      setUserTickets(prev => prev.filter(t => t.ticket_id !== ticket.ticket_id));
                                    } else {
                                      console.error('Failed to delete ticket');
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
                        <div className="text-base text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                          <p><strong>Concern:</strong> {ticket.concern}</p>
                          {ticket.details && <p><strong>Details:</strong> {ticket.details}</p>}
                          <p><strong>Filed:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ));
                    toast.dismiss(t);
                  }}
                  className="w-[28rem] bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-medium">{ticket.ticket_id}</span>
                    <span className="text-base text-gray-500">{ticket.category_name || ticket.sector}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-start">
                    {ticket.status === 'Closed' && (
                      <span 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
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
                              // Remove ticket from local state
                              setUserTickets(prev => prev.filter(t => t.ticket_id !== ticket.ticket_id));
                            } else {
                              console.error('Failed to delete ticket');
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
              ));
            }, index * 1000); // 1 second delay between each toast
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user tickets:', error);
      }
    };

    fetchUserTickets();
    
    // Set up real-time notifications
    if (userData?.id) {
      const eventSource = new EventSource(`/api/notifications?userId=${userData.id}`)
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'ticket_update') {
            // Update tickets and show new toasts for new tickets only
            const currentTicketIds = new Set(userTickets.map(t => t.ticket_id))
            const newTickets = data.tickets.filter((ticket: any) => !currentTicketIds.has(ticket.ticket_id))
            
            // Only update state and show toasts if there are new tickets
            if (newTickets.length > 0) {
              setUserTickets(data.tickets)
              
              // Show toasts for new tickets only
              newTickets.forEach((ticket: any) => {
                                 // Check if we've already shown a toast for this ticket
                 if (!shownToastIds.has(ticket.ticket_id)) {
                   setShownToastIds(prev => new Set([...prev, ticket.ticket_id]))
                   
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

                   toast.custom((t) => (
                     <div 
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         toast.custom((expandedToast) => (
                           <div 
                             className="w-[28rem] bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                           >
                             <div className="flex items-center justify-between mb-3">
                               <span className="text-base">{ticket.ticket_id}</span>
                               <div className="flex items-center gap-2 justify-start">
                                 {ticket.status === 'Closed' && (
                                   <span 
                                     onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       toast.dismiss(expandedToast);
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
                                           toast.dismiss(expandedToast);
                                           // Remove ticket from local state
                                           setUserTickets(prev => prev.filter(t => t.ticket_id !== ticket.ticket_id));
                                         } else {
                                           console.error('Failed to delete ticket');
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
                             <div className="text-base text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                               <p><strong>Concern:</strong> {ticket.concern}</p>
                               {ticket.details && <p><strong>Details:</strong> {ticket.details}</p>}
                               <p><strong>Filed:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
                             </div>
                           </div>
                         ));
                         toast.dismiss(t);
                       }}
                       className="w-[28rem] bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                     >
                       <div className="flex flex-col">
                         <span className="text-base font-medium">{ticket.ticket_id}</span>
                         <span className="text-base text-gray-500">{ticket.category_name || ticket.sector}</span>
                       </div>
                       <div className="flex items-center gap-2 justify-start">
                         {ticket.status === 'Closed' && (
                           <span 
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
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
                                   // Remove ticket from local state
                                   setUserTickets(prev => prev.filter(t => t.ticket_id !== ticket.ticket_id));
                                 } else {
                                   console.error('Failed to delete ticket');
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
                   ));
                 }
               });
             }
           } catch (error) {
          console.error('Error parsing notification data:', error)
        }
      }
      
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
      }
      
      setNotificationEventSource(eventSource)
    }
    
    // Cleanup function
    return () => {
      if (notificationEventSource) {
        notificationEventSource.close()
      }
      // Reset shown toast IDs when component unmounts or user changes
      setShownToastIds(new Set())
    }
  }, [userData?.id])

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
                    <div className="align-center m-auto margin-large px-4 sm:px-0">
                      <div className="margin-top margin-xxlarge">
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
