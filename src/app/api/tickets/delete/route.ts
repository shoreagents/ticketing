import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db-service'

export async function DELETE(request: NextRequest) {
  try {
    const { ticketId } = await request.json()
    
    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'Ticket ID is required' }, { status: 400 })
    }

    // Delete the ticket from database
    const result = await DatabaseService.deleteTicket(ticketId)
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Ticket deleted successfully'
      })
    } else {
      return NextResponse.json({ success: false, error: 'Ticket not found or could not be deleted' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete ticket' }, { status: 500 })
  }
} 