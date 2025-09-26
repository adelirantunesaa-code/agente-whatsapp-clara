import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    
    // Salvar configurações em arquivo JSON
    const configPath = path.join(process.cwd(), 'config.json')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'config.json')
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      return NextResponse.json(config)
    } else {
      return NextResponse.json({
        ijuiNumber: '',
        catuipeNumber: '',
        googleSheetsId: '',
        googleCalendarId: ''
      })
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}