import { Client, LocalAuth, Message } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { GoogleSheetsService } from './google-sheets-service'
import { GoogleCalendarService } from './google-calendar-service'
import { ClaraAI } from './clara-ai'

interface ClientInfo {
  name: string
  number: string
}

interface ConnectionResult {
  success: boolean
  qrCode?: string
  clientInfo?: ClientInfo
}

export class WhatsAppService {
  private static instance: WhatsAppService
  private client: Client | null = null
  private isConnected = false
  private qrCodeData: string | null = null
  private claraAI: ClaraAI
  private googleSheets: GoogleSheetsService
  private googleCalendar: GoogleCalendarService

  private constructor() {
    this.claraAI = new ClaraAI()
    this.googleSheets = new GoogleSheetsService()
    this.googleCalendar = new GoogleCalendarService()
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService()
    }
    return WhatsAppService.instance
  }

  public async connect(): Promise<ConnectionResult> {
    if (this.isConnected && this.client) {
      const info = await this.client.info
      return {
        success: true,
        clientInfo: {
          name: info.pushname || 'WhatsApp Business',
          number: info.wid.user
        }
      }
    }

    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'casa-demovelli-clara'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    })

    return new Promise((resolve) => {
      this.client!.on('qr', (qr) => {
        this.qrCodeData = qr
        qrcode.generate(qr, { small: true })
        console.log('QR Code gerado para WhatsApp')
        resolve({
          success: false,
          qrCode: qr
        })
      })

      this.client!.on('ready', async () => {
        console.log('WhatsApp conectado com sucesso!')
        this.isConnected = true
        
        const info = await this.client!.info
        resolve({
          success: true,
          clientInfo: {
            name: info.pushname || 'WhatsApp Business',
            number: info.wid.user
          }
        })
      })

      this.client!.on('message', async (message: Message) => {
        await this.handleMessage(message)
      })

      this.client!.on('disconnected', (reason) => {
        console.log('WhatsApp desconectado:', reason)
        this.isConnected = false
      })

      this.client!.initialize()
    })
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy()
      this.client = null
      this.isConnected = false
      this.qrCodeData = null
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    try {
      // Ignorar mensagens próprias e de grupos
      if (message.fromMe || message.from.includes('@g.us')) {
        return
      }

      const contact = await message.getContact()
      const chatId = message.from
      const messageBody = message.body.trim()

      console.log(`Mensagem recebida de ${contact.name || contact.number}: ${messageBody}`)

      // Processar mensagem com a Clara AI
      const response = await this.claraAI.processMessage(chatId, messageBody, {
        name: contact.name || contact.pushname || 'Cliente',
        number: contact.number
      })

      // Enviar resposta
      if (response.message) {
        await message.reply(response.message)
      }

      // Se o fluxo foi finalizado, processar integrações
      if (response.completed && response.leadData) {
        await this.processCompletedLead(response.leadData)
      }

      // Se precisa encaminhar para unidade
      if (response.forwardToUnit && response.leadData) {
        await this.forwardToUnit(response.leadData, response.forwardToUnit)
      }

    } catch (error) {
      console.error('Erro ao processar mensagem:', error)
      await message.reply('Desculpe, ocorreu um erro. Tente novamente em alguns instantes.')
    }
  }

  private async processCompletedLead(leadData: any): Promise<void> {
    try {
      // Registrar no Google Sheets
      await this.googleSheets.addLead(leadData)
      
      // Criar evento no Google Calendar
      await this.googleCalendar.createLeadEvent(leadData)
      
      console.log('Lead processado com sucesso:', leadData.nome)
    } catch (error) {
      console.error('Erro ao processar lead completo:', error)
    }
  }

  private async forwardToUnit(leadData: any, unit: string): Promise<void> {
    try {
      // Carregar configurações
      const fs = require('fs')
      const path = require('path')
      const configPath = path.join(process.cwd(), 'config.json')
      
      if (!fs.existsSync(configPath)) {
        console.log('Arquivo de configuração não encontrado')
        return
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      const unitNumber = unit === 'Ijui' ? config.ijuiNumber : config.catuipeNumber

      if (!unitNumber) {
        console.log(`Número da unidade ${unit} não configurado`)
        return
      }

      // Formatar mensagem de encaminhamento
      const forwardMessage = `
🏠 *NOVO LEAD - Casa Demovélli*

👤 *Cliente:* ${leadData.nome}
📱 *Telefone:* ${leadData.telefone}
🏙️ *Cidade:* ${leadData.cidade}
🏗️ *Projeto:* ${leadData.projeto}
🏠 *Ambiente:* ${leadData.ambiente}
📍 *Unidade:* ${leadData.unidade}

_Lead capturado pela Clara em ${new Date().toLocaleString('pt-BR')}_
      `.trim()

      // Enviar para a unidade (simulado - em produção seria via API do WhatsApp Business)
      console.log(`Encaminhando para ${unit} (${unitNumber}):`, forwardMessage)
      
    } catch (error) {
      console.error('Erro ao encaminhar para unidade:', error)
    }
  }

  public isClientConnected(): boolean {
    return this.isConnected
  }

  public getQRCode(): string | null {
    return this.qrCodeData
  }
}