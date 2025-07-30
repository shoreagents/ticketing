"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { CircleDollarSignIcon } from '@/components/ui/circle-dollar-sign'
import { useRef, useEffect } from 'react'
import { toast } from 'sonner'



function TicketButton() {
  const scrollToCards = () => {
    const cardsSection = document.querySelector('.cards-grid');
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button className="ticket-button" onClick={scrollToCards}>
      File a Ticket
    </Button>
  )
}

function FinanceCard() {
  const iconRef = useRef<any>(null);

  return (
    <div 
      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer" 
      onClick={() => window.location.href = '/form?category=Finance'}
      onMouseEnter={() => {
        if (iconRef.current?.startAnimation) {
          iconRef.current.startAnimation();
        }
      }}
      onMouseLeave={() => {
        if (iconRef.current?.stopAnimation) {
          iconRef.current.stopAnimation();
        }
      }}
    >
      <div className="flex flex-col h-full">
        <div className="pd-right-medium text-left p-6">
          <h3 className="display-7 mid flex items-center gap-2">
            <CircleDollarSignIcon 
              ref={iconRef}
              className="w-8 h-8" 
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
            Finance
          </h3>
          <div className="inner-container">
            <p className="mg-top-2x-extra-small">Financial support and expense management for your workplace needs.</p>
          </div>
        </div>
        <div className="inner-container _464px left---100-tablet mt-auto flex items-end justify-end w-full">
          <div className="features-image-v2">
            <img 
              src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/floor-plans/public/ticketing/finance.png"
              alt="Finance"
              className="w-auto h-50 object-contain inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    // No auto-load toasts
  }, [])



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
              <div className="container-small">
                <div className="padding-section-large is-hero">
                  <div className="text-align-center">
                    <div className="max-width-medium align-center">
                      <div className="margin-top margin-xxlarge">
                        <div className="margin-bottom margin-small">
                          <h1 className="heading-style-h1">Need <span style={{color: 'rgb(48 134 64)'}}>support</span>? We've got <span style={{color: 'rgb(48 134 64)'}}>you</span>.</h1>
                        </div>
                      </div>
                      <p className="text-size-xlarge">Your all-in-one ticketing system for workplace needs.</p>
                      <div className="margin-top margin-medium">
                        <div className="button-group is-center">
                          <TicketButton />
                        </div>
                        <div className="margin-top margin-small">
                          <div className="button-group is-center">
                            <Button onClick={() => {
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
                              
                              toast.custom((t) => (
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toast.custom((expandedToast) => (
                                      <div 
                                        className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-xs">Ticket #TK-2024-006</span>
                                          <span className="px-3 py-1 text-[10px] font-medium bg-gray-100 text-gray-800 rounded-[16px]">On Hold</span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                                          <p><strong>Description:</strong> User reported login issues with the new system</p>
                                          <p><strong>Priority:</strong> Medium</p>
                                          <p><strong>Assigned to:</strong> John Smith</p>
                                          <p><strong>Created:</strong> 2 hours ago</p>
                                        </div>
                                      </div>
                                    ));
                                    toast.dismiss(t);
                                  }}
                                  className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                >
                                  <span className="text-xs">Ticket #TK-2024-006</span>
                                  <span className="px-3 py-1 text-[10px] font-medium bg-gray-100 text-gray-800 rounded-[16px]">On Hold</span>
                                </div>
                              ))
                              toast.custom((t) => (
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toast.custom((expandedToast) => (
                                      <div 
                                        className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-xs">Ticket #TK-2024-007</span>
                                          <div className="flex items-center gap-2">
                                            <span 
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toast.dismiss(expandedToast);
                                              }}
                                              className="px-3 py-1 text-[10px] font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
                                            >
                                              Cancel
                                            </span>
                                            <span className="px-3 py-1 text-[10px] font-medium bg-blue-100 text-blue-800 rounded-[16px]">For Approval</span>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                                          <p><strong>Description:</strong> New feature request for mobile app</p>
                                          <p><strong>Priority:</strong> High</p>
                                          <p><strong>Assigned to:</strong> Sarah Johnson</p>
                                          <p><strong>Created:</strong> 1 hour ago</p>
                                        </div>
                                      </div>
                                    ));
                                    toast.dismiss(t);
                                  }}
                                  className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                >
                                  <span className="text-xs">Ticket #TK-2024-007</span>
                                  <div className="flex items-center gap-2">
                                    <span 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toast.dismiss(t);
                                      }}
                                      className="px-3 py-1 text-[10px] font-medium bg-red-100 text-red-800 rounded-[16px] hover:bg-red-200 hover:text-red-900 transition-all duration-200 ease-in-out cursor-pointer"
                                    >
                                      Cancel
                                    </span>
                                    <span className="px-3 py-1 text-[10px] font-medium bg-blue-100 text-blue-800 rounded-[16px]">For Approval</span>
                                  </div>
                                </div>
                              ))
                              toast.custom((t) => (
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toast.custom((expandedToast) => (
                                      <div 
                                        className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-xs">Ticket #TK-2024-008</span>
                                          <span className="px-3 py-1 text-[10px] font-medium bg-yellow-100 text-yellow-800 rounded-[16px]">In Progress</span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                                          <p><strong>Description:</strong> Bug fix for payment processing</p>
                                          <p><strong>Priority:</strong> Medium</p>
                                          <p><strong>Assigned to:</strong> Mike Davis</p>
                                          <p><strong>Created:</strong> 3 hours ago</p>
                                        </div>
                                      </div>
                                    ));
                                    toast.dismiss(t);
                                  }}
                                  className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                >
                                  <span className="text-xs">Ticket #TK-2024-008</span>
                                  <span className="px-3 py-1 text-[10px] font-medium bg-yellow-100 text-yellow-800 rounded-[16px]">In Progress</span>
                                </div>
                              ))
                              toast.custom((t) => (
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toast.custom((expandedToast) => (
                                      <div 
                                        className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-xs">Ticket #TK-2024-009</span>
                                          <span className="px-3 py-1 text-[10px] font-medium bg-green-100 text-green-800 rounded-[16px]">Approved</span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                                          <p><strong>Description:</strong> Office equipment replacement request</p>
                                          <p><strong>Priority:</strong> Low</p>
                                          <p><strong>Assigned to:</strong> Lisa Chen</p>
                                          <p><strong>Created:</strong> 5 hours ago</p>
                                        </div>
                                      </div>
                                    ));
                                    toast.dismiss(t);
                                  }}
                                  className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                >
                                  <span className="text-xs">Ticket #TK-2024-009</span>
                                  <span className="px-3 py-1 text-[10px] font-medium bg-green-100 text-green-800 rounded-[16px]">Approved</span>
                                </div>
                              ))
                              toast.custom((t) => (
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toast.custom((expandedToast) => (
                                      <div 
                                        className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <span className="text-xs">Ticket #TK-2024-010</span>
                                          <div className="flex items-center gap-2">
                                            <span 
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toast.dismiss(expandedToast);
                                              }}
                                              className="px-3 py-1 text-[10px] font-medium bg-orange-100 text-orange-800 rounded-[16px] hover:bg-orange-200 hover:text-orange-900 transition-all duration-200 ease-in-out cursor-pointer"
                                            >
                                              Thanks
                                            </span>
                                            <span className="px-3 py-1 text-[10px] font-medium bg-green-100 text-green-800 rounded-[16px]">Completed</span>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-3">
                                          <p><strong>Description:</strong> Customer satisfaction survey completed</p>
                                          <p><strong>Priority:</strong> Low</p>
                                          <p><strong>Assigned to:</strong> Customer Support Team</p>
                                          <p><strong>Created:</strong> 1 day ago</p>
                                        </div>
                                      </div>
                                    ));
                                    toast.dismiss(t);
                                  }}
                                  className="w-96 bg-white border border-gray-200 rounded-[16px] px-4 py-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                >
                                  <span className="text-xs">Ticket #TK-2024-010</span>
                                  <div className="flex items-center gap-2">
                                    <span 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toast.dismiss(t);
                                      }}
                                      className="px-3 py-1 text-[10px] font-medium bg-orange-100 text-orange-800 rounded-[16px] hover:bg-orange-200 hover:text-orange-900 transition-all duration-200 ease-in-out cursor-pointer"
                                    >
                                      Thanks
                                    </span>
                                    <span className="px-3 py-1 text-[10px] font-medium bg-green-100 text-green-800 rounded-[16px]">Completed</span>
                                  </div>
                                </div>
                              ))
                            }}>
                              Stack Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-image is-1">
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/6569c0c8628e87658209928f_Group%2039613.svg" loading="lazy" alt="" className="hero-image-inner" />
            </div>
            <div className="hero-image is-2">
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/6569c1b515505c2b51722691_Group%2039614.svg" loading="lazy" alt="" className="hero-image-inner" />
            </div>
            <div className="hero-image is-3">
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/6569c00c050a0d478f440bf5_Group.svg" loading="lazy" alt="" className="hero-image-inner" />
            </div>
            <div className="hero-image is-4">
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/6569c3042c26a007f73066fa_Group%2039587.svg" loading="lazy" alt="" className="hero-image-inner" />
            </div>
            <div className="hero-image is-5">
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/6569c3dc5af680820d0f1543_Group%2039616.svg" loading="lazy" alt="" className="hero-image-inner" />
            </div>
            <div className="hero-image is-6">
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/6569c4361f6d3278e217a20b_Group.svg" loading="lazy" alt="" className="hero-image-inner" />
            </div>
            <div>
              <img src="https://cdn.prod.website-files.com/64d635a2ee91b562a69c08b2/64f9c9d390c95d7dfcd800a4_portfolio-shape.svg" loading="lazy" alt="" className="portfolio6_animation-image is-line" />
            </div>
          </header>
          
          {/* New Cards Section */}
          <section>
            <div>
              <div>
                <div className="mb-10">
                  <div className="cards-grid">
                    {/* Row 1 */}
                    <div 
                      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer" 
                      onClick={() => window.location.href = '/form?category=IT'}
                    >
                      <div className="card-content">
                        <h3>IT</h3>
                      </div>
                    </div>
                    <div 
                      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer" 
                      onClick={() => window.location.href = '/form?category=Maintenance'}
                    >
                      <div className="card-content">
                        <h3>Maintenance</h3>
                      </div>
                    </div>
                    <FinanceCard />
                    
                    {/* Row 2 */}
                    <div 
                      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer" 
                      onClick={() => window.location.href = '/form?category=Admin'}
                    >
                      <div className="card-content">
                        <h3>Admin</h3>
                      </div>
                    </div>
                    <div 
                      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer" 
                      onClick={() => window.location.href = '/form?category=Transport'}
                    >
                      <div className="card-content">
                        <h3>Transport</h3>
                      </div>
                    </div>
                    <div 
                      className="card-item bg-gray-200 transition-all duration-500 ease-in-out hover:scale-105 hover:bg-white cursor-pointer" 
                      onClick={() => window.location.href = '/form?category=Others'}
                    >
                      <div className="card-content">
                        <h3>Others</h3>
                      </div>
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
