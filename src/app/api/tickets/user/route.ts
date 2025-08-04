import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db-service'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/tickets/user called');
    
    const userDataHeader = request.headers.get('user-data')
    console.log('User data header:', userDataHeader);
    
    if (!userDataHeader) {
      console.log('No user data header provided');
      return NextResponse.json({ success: false, error: 'User data not provided' }, { status: 400 })
    }

    const userData = JSON.parse(userDataHeader)
    console.log('Parsed user data:', userData);
    
    // Get user ID from the authenticated user data
    const userId = userData.id
    console.log('User ID:', userId);
    
    if (!userId) {
      console.log('No user ID found');
      return NextResponse.json({ success: false, error: 'User ID not found' }, { status: 400 })
    }

    // Fetch user's tickets
    console.log('Fetching tickets for user ID:', userId);
    const tickets = await DatabaseService.getUserTickets(userId)
    console.log('Retrieved tickets:', tickets);
    
    return NextResponse.json({
      success: true,
      tickets: tickets
    })
  } catch (error) {
    console.error('Error fetching user tickets:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 })
  }
} 