import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Formatar para padrão brasileiro
  if (cleaned.length === 11) {
    return `+55${cleaned}`
  } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return `+${cleaned}`
  }
  
  return phone
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 13
}

export function generateLeadId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function sanitizeMessage(message: string): string {
  return message
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 1000) // Limitar tamanho
}

export function extractKeywords(message: string): string[] {
  const keywords = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
  
  return [...new Set(keywords)]
}

export function isBusinessHours(): boolean {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  
  // Segunda a sexta: 8h às 18h
  // Sábado: 8h às 12h
  // Domingo: fechado
  
  if (day === 0) return false // Domingo
  if (day === 6) return hour >= 8 && hour < 12 // Sábado
  return hour >= 8 && hour < 18 // Segunda a sexta
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}