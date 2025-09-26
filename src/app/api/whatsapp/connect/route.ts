import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppService } from '@/lib/whatsapp-service'

export async function POST(request: NextRequest) {
  try {
    const whatsappService = WhatsAppService.getInstance()
    
    const result = await whatsappService.connect()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        clientInfo: result.clientInfo
      })
    } else {
      return NextResponse.json({
        success: false,
        qrCode: result.qrCode
      })
    }
  } catch (error) {
    console.error('Erro ao conectar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}