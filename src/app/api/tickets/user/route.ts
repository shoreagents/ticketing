import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db-service'

export async function GET(request: NextRequest) {
  try {
    const userDataHeader = request.headers.get('user-data')
    
    if (!userDataHeader) {
      return NextResponse.json({ success: false, error: 'User data not provided' }, { status: 400 })
    }

    const userData = JSON.parse(userDataHeader)
    
    // Get user ID from the authenticated user data
    const userId = userData.id
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID not found' }, { status: 400 })
    }

    // Fetch user's tickets
    const tickets = await DatabaseService.getUserTickets(userId)
    
    return NextResponse.json({
      success: true,
      tickets: tickets
    })
  } catch (error) {
    console.error('Error fetching user tickets:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 })
  }
} 