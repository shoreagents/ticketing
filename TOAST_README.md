# 🎫 Ticket Toast Notifications

This project includes a custom Sonner toast component specifically designed for displaying ticket details in the HelpDesk Pro ticketing system.

## Features

- **Custom Ticket Toasts**: Beautiful toast notifications that display ticket ID, concern, status, category, and priority
- **Status-Based Styling**: Different colors and icons for each ticket status (new, in-progress, pending, urgent, resolved, cancelled)
- **Category Colors**: Each ticket category has its own color scheme matching the design specifications
- **Responsive Design**: Toasts adapt to different screen sizes
- **Accessibility**: Proper contrast ratios and keyboard navigation support

## Installation

The Sonner package has been installed and configured. The toast component is ready to use.

## Usage

### Basic Usage

```tsx
import { showTicketToast, type TicketDetails } from "@/components/ui/toast"

const ticket: TicketDetails = {
  id: "TK-2024-001",
  concern: "Server connectivity issues affecting multiple departments",
  status: "urgent",
  category: "IT",
  priority: "Critical",
  createdAt: "2 hours ago"
}

// Show the toast
showTicketToast(ticket)
```

### Convenience Functions

For common ticket statuses, you can use the convenience functions:

```tsx
import { 
  showNewTicketToast,
  showInProgressTicketToast,
  showResolvedTicketToast,
  showUrgentTicketToast
} from "@/components/ui/toast"

// Show a new ticket toast
showNewTicketToast({
  id: "TK-2024-002",
  concern: "New software installation request",
  category: "IT",
  priority: "Medium",
  createdAt: "Just now"
})

// Show an in-progress ticket toast
showInProgressTicketToast({
  id: "TK-2024-003",
  concern: "Database backup verification",
  category: "IT",
  priority: "High",
  createdAt: "4 hours ago"
})

// Show a resolved ticket toast
showResolvedTicketToast({
  id: "TK-2024-004",
  concern: "Printer cartridge replacement",
  category: "Maintenance",
  priority: "Medium",
  createdAt: "1 day ago"
})

// Show an urgent ticket toast
showUrgentTicketToast({
  id: "TK-2024-005",
  concern: "Network security breach detected",
  category: "IT",
  priority: "Critical",
  createdAt: "5 minutes ago"
})
```

## Ticket Details Interface

```tsx
interface TicketDetails {
  id: string                    // Ticket ID (e.g., "TK-2024-001")
  concern: string              // Ticket description/concern
  status: 'new' | 'in-progress' | 'pending' | 'urgent' | 'resolved' | 'cancelled'
  category?: 'IT' | 'Admin' | 'Transport' | 'Finance' | 'Maintenance' | 'Others'
  priority?: 'Critical' | 'High' | 'Medium' | 'Low'
  createdAt?: string           // Creation timestamp (e.g., "2 hours ago")
}
```

## Status Colors

Each ticket status has its own color scheme:

- 🔵 **New** - Blue theme with Info icon
- 🟡 **In Progress** - Yellow theme with Clock icon  
- 🟠 **Pending** - Orange theme with Clock icon
- 🔴 **Urgent** - Red theme with AlertCircle icon
- ✅ **Resolved** - Green theme with CheckCircle icon
- ⚫ **Cancelled** - Gray theme with XCircle icon

## Category Colors

Each category uses the design specification colors:

- 💻 **IT** - Steel Blue (#4A90A4)
- 📁 **Admin** - Dark Goldenrod (#B8860B)
- 🚗 **Transport** - Forest Green (#228B22)
- 💰 **Finance** - Peru (#CD853F)
- 🔧 **Maintenance** - Chocolate (#D2691E)
- 📋 **Others** - Slate Gray (#708090)

## Toast Configuration

The toasts are configured with:

- **Position**: Top-right corner
- **Duration**: 5 seconds
- **Rich Colors**: Enabled for better visual appeal
- **Close Button**: Available for manual dismissal
- **Animations**: Smooth enter/exit animations

## Demo

Run the development server to see the toast notifications in action:

```bash
npm run dev
```

Visit the homepage to see the demo with sample tickets and quick action buttons.

## Integration

The toast component is already integrated into the app layout. The `<Toaster />` component is added to `src/app/layout.tsx` to enable toast notifications throughout the application.

## Customization

You can customize the toast appearance by modifying the `getStatusConfig` and `getCategoryColor` functions in `src/components/ui/toast.tsx`.

## Examples

See `src/components/ui/toast-example.tsx` for a complete example of how to use the toast component with different ticket scenarios. 