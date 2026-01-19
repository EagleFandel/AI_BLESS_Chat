import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'chat.db')

function getDb() {
  const db = new Database(dbPath)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `)
  
  return db
}

export async function GET() {
  try {
    const db = getDb()
    const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all()
    db.close()
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    const db = getDb()
    
    const insert = db.prepare(`
      INSERT OR REPLACE INTO messages (id, role, content, timestamp)
      VALUES (?, ?, ?, ?)
    `)
    
    for (const msg of messages) {
      insert.run(msg.id, msg.role, msg.content, msg.timestamp)
    }
    
    db.close()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save messages error:', error)
    return NextResponse.json(
      { error: '保存失败' },
      { status: 500 }
    )
  }
}
