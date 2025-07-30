"use client"

import { Button } from '@/components/ui/button'
import { CircleDollarSignIcon } from '@/components/ui/circle-dollar-sign'
import { useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { showTicketToast } from '@/components/ui/toast'

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
    // Show all test toasts immediately without delays
    showTicketToast({
      id: 'TEST-001',
      concern: 'Test Alert 1 - This is a persistent notification for testing',
      status: 'For Approval',
      category: 'IT',
      priority: 'High',
      createdAt: new Date().toLocaleString()
    })
    
    showTicketToast({
      id: 'TEST-002',
      concern: 'Test Alert 2 - Another persistent notification',
      status: 'In Progress',
      category: 'Admin',
      priority: 'Medium',
      createdAt: new Date().toLocaleString()
    })
    
    showTicketToast({
      id: 'TEST-003',
      concern: 'Test Alert 3 - Third persistent notification',
      status: 'On Hold',
      category: 'Finance',
      priority: 'Critical',
      createdAt: new Date().toLocaleString()
    })
  }, [])

  const showOnHoldToast = () => {
    showTicketToast({
      id: 'HOLD-001',
      concern: 'Ticket is currently on hold',
      status: 'On Hold',
      category: 'IT',
      priority: 'High',
      createdAt: new Date().toLocaleString()
    })
  }

  const showForApprovalToast = () => {
    showTicketToast({
      id: 'APPROVAL-001',
      concern: 'Ticket is waiting for approval',
      status: 'For Approval',
      category: 'Admin',
      priority: 'Medium',
      createdAt: new Date().toLocaleString()
    })
  }

  const showApprovedToast = () => {
    showTicketToast({
      id: 'APPROVED-001',
      concern: 'Ticket has been approved',
      status: 'Approved',
      category: 'Finance',
      priority: 'Critical',
      createdAt: new Date().toLocaleString()
    })
  }

  const showInProgressToast = () => {
    showTicketToast({
      id: 'PROG-001',
      concern: 'Ticket is currently being worked on',
      status: 'In Progress',
      category: 'Maintenance',
      priority: 'Low',
      createdAt: new Date().toLocaleString()
    })
  }

  const showCompletedToast = () => {
    showTicketToast({
      id: 'COMP-001',
      concern: 'Ticket has been completed successfully',
      status: 'Completed',
      category: 'Transport',
      priority: 'Medium',
      createdAt: new Date().toLocaleString()
    })
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
                            <Button onClick={showOnHoldToast} className="mr-2">
                              Test On Hold
                            </Button>
                            <Button onClick={showForApprovalToast} className="mr-2">
                              Test For Approval
                            </Button>
                            <Button onClick={showApprovedToast} className="mr-2">
                              Test Approved
                            </Button>
                            <Button onClick={showInProgressToast} className="mr-2">
                              Test In Progress
                            </Button>
                            <Button onClick={showCompletedToast}>
                              Test Completed
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
