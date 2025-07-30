import { toast } from "sonner"
import { CheckCircle, Clock, AlertCircle, XCircle, Info } from "lucide-react"

export interface TicketDetails {
  id: string
  concern: string
  status: 'new' | 'in-progress' | 'pending' | 'urgent' | 'resolved' | 'cancelled'
  category?: 'IT' | 'Admin' | 'Transport' | 'Finance' | 'Maintenance' | 'Others'
  priority?: 'Critical' | 'High' | 'Medium' | 'Low'
  createdAt?: string
}

const getStatusConfig = (status: TicketDetails['status']) => {
  switch (status) {
    case 'new':
      return {
        icon: Info,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    case 'in-progress':
      return {
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    case 'pending':
      return {
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    case 'urgent':
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    case 'resolved':
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    case 'cancelled':
      return {
        icon: XCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      }
    default:
      return {
        icon: Info,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
  }
}

const getCategoryColor = (category?: TicketDetails['category']) => {
  switch (category) {
    case 'IT':
      return 'text-[#4A90A4]'
    case 'Admin':
      return 'text-[#B8860B]'
    case 'Transport':
      return 'text-[#228B22]'
    case 'Finance':
      return 'text-[#CD853F]'
    case 'Maintenance':
      return 'text-[#D2691E]'
    case 'Others':
      return 'text-[#708090]'
    default:
      return 'text-gray-600'
  }
}

export const showTicketToast = (ticket: TicketDetails) => {
  const statusConfig = getStatusConfig(ticket.status)
  const StatusIcon = statusConfig.icon
  const categoryColor = getCategoryColor(ticket.category)

  toast.custom(
    (t) => (
      <div className="w-96 bg-white border border-gray-200 rounded-2xl shadow-lg pointer-events-auto p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Ticket #{ticket.id} - {ticket.status.replace('-', ' ')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {ticket.concern}
            </p>
            {ticket.category && ticket.priority && (
              <p className="text-xs text-gray-400 mt-1">
                {ticket.category} • {ticket.priority} Priority
              </p>
            )}
            {ticket.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                Created: {ticket.createdAt}
              </p>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
    }
  )
}

// Convenience functions for different ticket statuses
export const showNewTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'new' })
}

export const showInProgressTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'in-progress' })
}

export const showResolvedTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'resolved' })
}

export const showUrgentTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'urgent' })
}

export { toast } 