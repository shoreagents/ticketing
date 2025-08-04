import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db-service'

export async function POST(request: NextRequest) {
  try {
    // Check if this is a multipart form data request
    const contentType = request.headers.get('content-type') || ''
    
    let concern: string, category: string, description: string, files: File[] = []
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      concern = formData.get('concern') as string
      category = formData.get('category') as string
      description = formData.get('description') as string
      files = formData.getAll('files') as File[]
    } else {
      // Handle JSON request (existing functionality)
      const data = await request.json()
      concern = data.concern
      category = data.category
      description = data.description

      files = []
    }

    // Get user data from request headers or session
    const userData = request.headers.get('user-data')
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User data not found' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userData)

    // Validate required fields
    if (!concern || !category) {
      return NextResponse.json(
        { success: false, error: 'Concern and category are required' },
        { status: 400 }
      )
    }

    // Debug: Log the category being sent
    console.log('Category being sent:', category)
    console.log('Category type:', typeof category)

    // Map category name to category_id
    const categoryMap: { [key: string]: number } = {
      'Computer & Equipment': 1,
      'Network & Internet': 2,
      'Station': 3,
      'Surroundings': 4,
      'Schedule': 5,
      'Compensation': 6,
      'Transport': 7,
      'Suggestion': 8,
      'Check-in': 9,
      'Others': 10
    }

    const categoryId = categoryMap[category] || undefined

    // Handle file uploads (currently disabled - Supabase not configured)
    const filePaths: string[] = []
    if (files && files.length > 0) {
      console.log('Files received:', files.length)
      console.log('File names:', files.map(f => f.name))
      console.log('File sizes:', files.map(f => f.size))
      console.log('File types:', files.map(f => f.type))
      // For now, we'll skip file uploads and just create the ticket
      // TODO: Configure Supabase for file uploads
    } else {
      console.log('No files received')
    }

    // Create ticket data
    const ticketData = {
      user_id: user.id,
      concern: concern,
      details: description || '',
      category_id: categoryId,
      status: 'For Approval', // Default status as per schema
      supporting_files: filePaths,
      file_count: filePaths.length
    }

    // Save ticket to Railway PostgreSQL database
    const newTicket = await DatabaseService.createTicket(ticketData)

    if (!newTicket) {
      return NextResponse.json(
        { success: false, error: 'Failed to create ticket' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: 'Ticket created successfully'
    })

  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user data from request headers
    const userData = request.headers.get('user-data')
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User data not found' },
        { status: 401 }
      )
    }

    const user = JSON.parse(userData)

    // Get user's tickets from Railway PostgreSQL database
    const tickets = await DatabaseService.getUserTickets(user.id)

    return NextResponse.json({
      success: true,
      tickets: tickets
    })

  } catch (error) {
    console.error('Get tickets error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 