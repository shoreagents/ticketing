import pool from './database'
import { User, JobInfo, Agent, Internal, Client, PersonalInfo } from './types'

export class DatabaseService {
  // Authenticate user by employee ID
  static async authenticateByEmployeeId(employeeId: string): Promise<{
    user: User
    jobInfo: JobInfo
    personalInfo?: PersonalInfo
    userType: 'agent' | 'internal' | 'client'
  } | null> {
    try {
      // First, find the job_info record by employee_id
      const jobInfoQuery = `
        SELECT * FROM job_info 
        WHERE employee_id = $1
      `
      const jobInfoResult = await pool.query(jobInfoQuery, [employeeId])
      
      if (jobInfoResult.rows.length === 0) {
        return null
      }

      const jobInfo = jobInfoResult.rows[0] as JobInfo
      let userId: number
      let userType: 'agent' | 'internal' | 'client'

      // Determine user type and get user ID
      if (jobInfo.agent_user_id) {
        userId = jobInfo.agent_user_id
        userType = 'agent'
      } else if (jobInfo.internal_user_id) {
        userId = jobInfo.internal_user_id
        userType = 'internal'
      } else {
        throw new Error('Invalid job info: neither agent nor internal user ID found')
      }

      // Get user information
      const userQuery = `
        SELECT * FROM users 
        WHERE id = $1
      `
      const userResult = await pool.query(userQuery, [userId])
      
      if (userResult.rows.length === 0) {
        return null
      }

      const user = userResult.rows[0] as User

      // Get personal info
      const personalInfoQuery = `
        SELECT * FROM personal_info 
        WHERE user_id = $1
      `
      const personalInfoResult = await pool.query(personalInfoQuery, [userId])
      const personalInfo = personalInfoResult.rows.length > 0 ? personalInfoResult.rows[0] as PersonalInfo : undefined

      return {
        user,
        jobInfo,
        personalInfo,
        userType
      }
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  // Get user by ID
  static async getUserById(userId: number): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1'
      const result = await pool.query(query, [userId])
      return result.rows.length > 0 ? result.rows[0] as User : null
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  // Get user's tickets
  static async getUserTickets(userId: number) {
    try {
      const query = `
        SELECT * FROM tickets 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `
      const result = await pool.query(query, [userId])
      return result.rows
    } catch (error) {
      console.error('Get user tickets error:', error)
      return []
    }
  }

  // Create a new ticket
  static async createTicket(ticketData: {
    user_id: number
    concern: string
    details?: string
    category: string
  }) {
    try {
      const ticketId = `TK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      
      const query = `
        INSERT INTO tickets (ticket_id, user_id, concern, details, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `
      const result = await pool.query(query, [
        ticketId,
        ticketData.user_id,
        ticketData.concern,
        ticketData.details,
        ticketData.category
      ])
      
      return result.rows[0]
    } catch (error) {
      console.error('Create ticket error:', error)
      throw error
    }
  }

  // Get all tickets (for agents/admins)
  static async getAllTickets() {
    try {
      const query = `
        SELECT t.*, u.email, pi.first_name, pi.last_name
        FROM tickets t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN personal_info pi ON u.id = pi.user_id
        ORDER BY t.created_at DESC
      `
      const result = await pool.query(query)
      return result.rows
    } catch (error) {
      console.error('Get all tickets error:', error)
      return []
    }
  }

  // Update ticket status
  static async updateTicketStatus(ticketId: string, status: string, resolvedBy?: number) {
    try {
      const query = `
        UPDATE tickets 
        SET status = $1, resolved_by = $2, resolved_at = CASE WHEN $1 = 'Completed' THEN NOW() ELSE NULL END
        WHERE ticket_id = $3
        RETURNING *
      `
      const result = await pool.query(query, [status, resolvedBy, ticketId])
      return result.rows[0]
    } catch (error) {
      console.error('Update ticket status error:', error)
      throw error
    }
  }
} 