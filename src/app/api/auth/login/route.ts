import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db-service'

export async function POST(request: NextRequest) {
  try {
    const { employeeId } = await request.json()

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    // Authenticate user by employee ID
    const authResult = await DatabaseService.authenticateByEmployeeId(employeeId)

    if (!authResult) {
      return NextResponse.json(
        { success: false, error: 'Invalid Employee ID' },
        { status: 401 }
      )
    }

    // Only allow internal users and agents (as per your requirement)
    if (authResult.userType !== 'internal' && authResult.userType !== 'agent') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only internal users and agents can access this system.' },
        { status: 403 }
      )
    }

    // Prepare user data for frontend
    const userData = {
      id: authResult.user.id,
      email: authResult.user.email,
      user_type: authResult.user.user_type,
      employee_id: authResult.jobInfo.employee_id,
      first_name: authResult.personalInfo?.first_name || '',
      last_name: authResult.personalInfo?.last_name || '',
      job_title: authResult.jobInfo.job_title || '',
      shift_period: authResult.jobInfo.shift_period,
      shift_schedule: authResult.jobInfo.shift_schedule,
      shift_time: authResult.jobInfo.shift_time,
      work_setup: authResult.jobInfo.work_setup,
      employment_status: authResult.jobInfo.employment_status,
      hire_type: authResult.jobInfo.hire_type,
      staff_source: authResult.jobInfo.staff_source,
      start_date: authResult.jobInfo.start_date,
      exit_date: authResult.jobInfo.exit_date
    }

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 