import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/lib/whatsapp-service'

export async function POST(request: NextRequest) {
  try {
    const whatsappService = WhatsAppService.getInstance()
    await whatsappService.disconnect()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao desconectar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}