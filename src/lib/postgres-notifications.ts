import { Pool, PoolClient } from 'pg'
import pool from './database'

export class PostgresNotificationListener {
  private pool: Pool
  private client: PoolClient | null = null
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map()

  constructor() {
    this.pool = pool
  }

  async connect() {
    try {
      this.client = await this.pool.connect()
      console.log('Connected to PostgreSQL for notifications')
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error)
      throw error
    }
  }

  async listen(channel: string, callback: (data: unknown) => void) {
    if (!this.client) {
      await this.connect()
    }

    try {
      // Add callback to listeners
      if (!this.listeners.has(channel)) {
        this.listeners.set(channel, [])
      }
      this.listeners.get(channel)!.push(callback)

      // Listen to the channel
      await this.client!.query(`LISTEN ${channel}`)
      console.log(`Listening to channel: ${channel}`)

      // Set up notification handler
      this.client!.on('notification', (msg: { channel: string; payload: string }) => {
        if (msg.channel === channel) {
          try {
            const data = JSON.parse(msg.payload)
            const callbacks = this.listeners.get(channel) || []
            callbacks.forEach(callback => callback(data))
          } catch (error) {
            console.error('Error parsing notification payload:', error)
          }
        }
      })

    } catch (error) {
      console.error(`Error listening to channel ${channel}:`, error)
      throw error
    }
  }

  async unlisten(channel: string) {
    if (!this.client) return

    try {
      await this.client!.query(`UNLISTEN ${channel}`)
      this.listeners.delete(channel)
      console.log(`Stopped listening to channel: ${channel}`)
    } catch (error) {
      console.error(`Error unlistening to channel ${channel}:`, error)
    }
  }

  async disconnect() {
    if (this.client) {
      this.client!.release()
      this.client = null
    }
  }
}

// Singleton instance
export const notificationListener = new PostgresNotificationListener() 