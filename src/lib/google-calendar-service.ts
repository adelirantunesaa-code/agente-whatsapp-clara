import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

export class GoogleCalendarService {
  private calendar: any
  private auth: any

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      // Carregar credenciais do Google (mesmo arquivo do Sheets)
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json')
      
      if (fs.existsSync(credentialsPath)) {
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
        
        this.auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/calendar']
        })

        this.calendar = google.calendar({ version: 'v3', auth: this.auth })
      } else {
        console.log('Arquivo de credenciais do Google não encontrado para Calendar')
      }
    } catch (error) {
      console.error('Erro ao inicializar Google Calendar:', error)
    }
  }

  public async createLeadEvent(leadData: any): Promise<void> {
    try {
      if (!this.calendar) {
        console.log('Google Calendar não configurado')
        return
      }

      // Carregar configurações
      const configPath = path.join(process.cwd(), 'config.json')
      if (!fs.existsSync(configPath)) {
        console.log('Arquivo de configuração não encontrado')
        return
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      const calendarId = config.googleCalendarId || 'primary'

      // Criar evento
      const event = {
        summary: `Novo Lead - ${leadData.nome} - Unidade ${leadData.unidade}`,
        description: `
📞 Telefone: ${leadData.telefone}
🏙️ Cidade: ${leadData.cidade}
🏗️ Projeto: ${leadData.projeto}
🏠 Ambiente: ${leadData.ambiente}
📍 Unidade: ${leadData.unidade}

Lead capturado pela Clara em ${new Date().toLocaleString('pt-BR')}
        `.trim(),
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora depois
          timeZone: 'America/Sao_Paulo'
        },
        attendees: [
          // Adicionar emails da equipe aqui se necessário
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 }
          ]
        }
      }

      const response = await this.calendar.events.insert({
        calendarId,
        resource: event
      })

      console.log('Evento criado no Google Calendar:', response.data.id)
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error)
    }
  }

  public async createReminder(leadData: any, reminderDate: Date): Promise<void> {
    try {
      if (!this.calendar) {
        console.log('Google Calendar não configurado')
        return
      }

      const configPath = path.join(process.cwd(), 'config.json')
      if (!fs.existsSync(configPath)) {
        return
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      const calendarId = config.googleCalendarId || 'primary'

      const event = {
        summary: `Lembrete: Contatar ${leadData.nome}`,
        description: `
Lembrete para entrar em contato com o lead:

👤 Nome: ${leadData.nome}
📞 Telefone: ${leadData.telefone}
🏙️ Cidade: ${leadData.cidade}
📍 Unidade: ${leadData.unidade}
        `.trim(),
        start: {
          dateTime: reminderDate.toISOString(),
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: new Date(reminderDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 min
          timeZone: 'America/Sao_Paulo'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 },
            { method: 'email', minutes: 60 }
          ]
        }
      }

      await this.calendar.events.insert({
        calendarId,
        resource: event
      })

      console.log('Lembrete criado no Google Calendar')
    } catch (error) {
      console.error('Erro ao criar lembrete:', error)
    }
  }
}