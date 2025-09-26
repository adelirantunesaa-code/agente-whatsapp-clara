export interface Lead {
  id: string
  nome: string
  telefone: string
  cidade: string
  projeto: string
  ambiente: string
  unidade: 'Ijui' | 'Catuipe'
  status: 'novo' | 'contatado' | 'agendado' | 'finalizado'
  data: string
  wantsContact?: boolean
}

export interface WhatsAppStatus {
  connected: boolean
  qrCode?: string
  clientInfo?: {
    name: string
    number: string
  }
}

export interface Config {
  ijuiNumber: string
  catuipeNumber: string
  googleSheetsId: string
  googleCalendarId: string
}

export interface UserSession {
  step: number
  data: Partial<Lead>
  lastActivity: Date
}

export interface ProcessResult {
  message: string
  completed?: boolean
  leadData?: Lead
  forwardToUnit?: string
}

export interface Stats {
  totalLeads: number
  leadsHoje: number
  leadsIjui: number
  leadsCatuipe: number
}

export interface ContactInfo {
  name: string
  number: string
}