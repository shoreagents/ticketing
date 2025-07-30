import { toast } from "sonner"
import { CheckCircle, Clock, AlertCircle, XCircle, Info } from "lucide-react"

export interface TicketDetails {
  id: string
  concern: string
  status: 'On Hold' | 'For Approval' | 'Approved' | 'In Progress' | 'Completed'
  category?: 'IT' | 'Admin' | 'Transport' | 'Finance' | 'Maintenance' | 'Others'
  priority?: 'Critical' | 'High' | 'Medium' | 'Low'
  createdAt?: string
}

const getStatusConfig = (status: TicketDetails['status']) => {
  switch (status) {
    case 'On Hold':
      return {
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    case 'For Approval':
      return {
        icon: Info,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    case 'Approved':
      return {
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    case 'In Progress':
      return {
        icon: Clock,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    case 'Completed':
      return {
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
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
      <div className={`w-96 ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-3xl shadow-lg pointer-events-auto p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
              <p className={`text-sm font-medium ${statusConfig.color}`}>
                Ticket #{ticket.id} - {ticket.status.replace('-', ' ')}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {ticket.concern}
            </p>
            {ticket.category && ticket.priority && (
              <p className={`text-xs ${categoryColor} mt-1`}>
                {ticket.category} • {ticket.priority} Priority
              </p>
            )}
            {ticket.createdAt && (
              <p className="text-xs text-gray-500 mt-1">
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
export const showOnHoldTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'On Hold' })
}

export const showForApprovalTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'For Approval' })
}

export const showApprovedTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'Approved' })
}

export const showInProgressTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'In Progress' })
}

export const showCompletedTicketToast = (ticket: Omit<TicketDetails, 'status'>) => {
  showTicketToast({ ...ticket, status: 'Completed' })
}

export { toast } 