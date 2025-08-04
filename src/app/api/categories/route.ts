import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    const query = 'SELECT id, name FROM ticket_categories ORDER BY id'
    const result = await pool.query(query)
    
    return NextResponse.json({
      success: true,
      categories: result.rows
    })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 