import { NextRequest } from 'next/server'
import { DatabaseService } from '@/lib/db-service'
import { notificationListener } from '@/lib/postgres-notifications'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  
  if (!userId) {
    return new Response('User ID required', { status: 400 })
  }

  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to notifications' })}\n\n`))
      
      // Set up PostgreSQL notification listener
      try {
        await notificationListener.listen('ticket_changes', async (notification: any) => {
          try {
            // Check if the notification is for this user's tickets
            if (notification.record && notification.record.user_id === parseInt(userId)) {
              // Fetch updated tickets for the user
              const tickets = await DatabaseService.getUserTickets(parseInt(userId))
              
              // Send updated tickets data
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'ticket_update', 
                tickets: tickets,
                action: notification.action,
                record: notification.record
              })}\n\n`))
            }
          } catch (error) {
            console.error('Error handling notification:', error)
          }
        })
      } catch (error) {
        console.error('Error setting up notification listener:', error)
        // Fallback to polling if notifications fail
        const pollInterval = setInterval(async () => {
          try {
            const tickets = await DatabaseService.getUserTickets(parseInt(userId))
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'ticket_update', 
              tickets: tickets 
            })}\n\n`))
          } catch (error) {
            console.error('Error polling tickets:', error)
          }
                 }, 10000) // Poll every 10 seconds instead of 5
        
        request.signal.addEventListener('abort', () => {
          clearInterval(pollInterval)
        })
      }
      
      // Clean up on close
      request.signal.addEventListener('abort', async () => {
        await notificationListener.unlisten('ticket_changes')
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
} 