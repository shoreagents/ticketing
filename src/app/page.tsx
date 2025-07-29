"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  showTicketToast, 
  showNewTicketToast, 
  showInProgressTicketToast, 
  showResolvedTicketToast, 
  showUrgentTicketToast,
  type TicketDetails 
} from "@/components/ui/toast"

export default function Home() {
  const demoTickets: TicketDetails[] = [
    {
      id: "TK-2024-001",
      concern: "Server connectivity issues affecting multiple departments",
      status: "urgent",
      category: "IT",
      priority: "Critical",
      createdAt: "2 hours ago"
    },
    {
      id: "TK-2024-002", 
      concern: "Need access to HR policy documents",
      status: "in-progress",
      category: "Admin",
      priority: "Medium",
      createdAt: "1 day ago"
    },
    {
      id: "TK-2024-003",
      concern: "Company car booking for client meeting",
      status: "new",
      category: "Transport",
      priority: "High",
      createdAt: "30 minutes ago"
    },
    {
      id: "TK-2024-004",
      concern: "Expense reimbursement for business trip",
      status: "pending",
      category: "Finance",
      priority: "Medium",
      createdAt: "3 days ago"
    },
    {
      id: "TK-2024-005",
      concern: "AC unit not working in conference room",
      status: "resolved",
      category: "Maintenance",
      priority: "High",
      createdAt: "1 week ago"
    },
    {
      id: "TK-2024-006",
      concern: "General inquiry about office policies",
      status: "cancelled",
      category: "Others",
      priority: "Low",
      createdAt: "2 days ago"
    }
  ]

  const handleShowTicket = (ticket: TicketDetails) => {
    showTicketToast(ticket)
  }

  const handleShowNewTicket = () => {
    showNewTicketToast({
      id: "TK-2024-007",
      concern: "New software installation request",
      category: "IT",
      priority: "Medium",
      createdAt: "Just now"
    })
  }

  const handleShowInProgress = () => {
    showInProgressTicketToast({
      id: "TK-2024-008",
      concern: "Database backup verification",
      category: "IT",
      priority: "High",
      createdAt: "4 hours ago"
    })
  }

  const handleShowResolved = () => {
    showResolvedTicketToast({
      id: "TK-2024-009",
      concern: "Printer cartridge replacement",
      category: "Maintenance",
      priority: "Medium",
      createdAt: "1 day ago"
    })
  }

  const handleShowUrgent = () => {
    showUrgentTicketToast({
      id: "TK-2024-010",
      concern: "Network security breach detected",
      category: "IT",
      priority: "Critical",
      createdAt: "5 minutes ago"
    })
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">
            🎫 HelpDesk Pro
          </h1>
          <p className="text-lg text-[#6B6B6B]">
            Ticket Toast Notification Demo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoTickets.map((ticket, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">#{ticket.id}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'urgent' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status.replace('-', ' ')}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {ticket.category} • {ticket.priority} Priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {ticket.concern}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {ticket.createdAt}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => handleShowTicket(ticket)}
                    className="text-xs"
                  >
                    Show Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleShowNewTicket}
                className="w-full"
                variant="outline"
              >
                New Ticket
              </Button>
              <Button 
                onClick={handleShowInProgress}
                className="w-full"
                variant="outline"
              >
                In Progress
              </Button>
              <Button 
                onClick={handleShowResolved}
                className="w-full"
                variant="outline"
              >
                Resolved
              </Button>
              <Button 
                onClick={handleShowUrgent}
                className="w-full"
                variant="outline"
              >
                Urgent
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
