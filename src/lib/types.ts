// Database types based on the schema
export type GenderEnum = 'Male' | 'Female' | 'Other' | 'Prefer not to say'
export type ItemTypeMedical = 'Medicine' | 'Supply'
export type MemberStatusEnum = 'Current Client' | 'Lost Client'
export type TicketCategoryEnum = 'Computer & Equipment' | 'Station' | 'Surroundings' | 'Schedule' | 'Compensation' | 'Transport' | 'Suggestion' | 'Check-in'
export type TicketStatusEnum = 'For Approval' | 'On Hold' | 'In Progress' | 'Approved' | 'Completed'
export type UserTypeEnum = 'Agent' | 'Client' | 'Internal'

export interface User {
  id: number
  email: string
  user_type: UserTypeEnum
  created_at: string
  updated_at: string
}

export interface PersonalInfo {
  id: number
  user_id: number
  first_name: string
  middle_name?: string
  last_name: string
  nickname?: string
  profile_picture?: string
  phone?: string
  birthday?: string
  city?: string
  address?: string
  gender?: GenderEnum
  created_at: string
  updated_at: string
}

export interface JobInfo {
  id: number
  employee_id: string
  agent_user_id?: number
  internal_user_id?: number
  job_title?: string
  shift_period?: string
  shift_schedule?: string
  shift_time?: string
  work_setup?: string
  employment_status?: string
  hire_type?: string
  staff_source?: string
  start_date?: string
  exit_date?: string
  created_at: string
  updated_at: string
}

export interface Agent {
  user_id: number
  exp_points?: number
  member_id: number
  department_id?: number
  created_at: string
  updated_at: string
}

export interface Internal {
  user_id: number
  created_at: string
  updated_at: string
}

export interface Client {
  user_id: number
  member_id: number
  department_id?: number
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: number
  ticket_id: string
  user_id: number
  concern: string
  details?: string
  category: TicketCategoryEnum
  status: TicketStatusEnum
  resolved_by?: number
  resolved_at?: string
  created_at: string
  updated_at: string
  position: number
}

export interface Member {
  id: number
  company: string
  address?: string
  phone?: string
  logo?: string
  service?: string
  status?: MemberStatusEnum
  created_at: string
  updated_at: string
  badge_color?: string
  country?: string
  website?: string[]
}

export interface Department {
  id: number
  name: string
  description?: string
  member_id: number
  created_at: string
  updated_at: string
} 