interface UserSession {
  step: number
  data: {
    nome?: string
    telefone?: string
    cidade?: string
    projeto?: string
    ambiente?: string
    unidade?: string
  }
  lastActivity: Date
}

interface ProcessResult {
  message: string
  completed?: boolean
  leadData?: any
  forwardToUnit?: string
}

export class ClaraAI {
  private sessions: Map<string, UserSession> = new Map()

  constructor() {
    // Limpar sessões antigas a cada hora
    setInterval(() => {
      this.cleanOldSessions()
    }, 60 * 60 * 1000)
  }

  public async processMessage(chatId: string, message: string, contact: { name: string, number: string }): Promise<ProcessResult> {
    let session = this.sessions.get(chatId)
    
    if (!session) {
      session = {
        step: 0,
        data: {},
        lastActivity: new Date()
      }
      this.sessions.set(chatId, session)
    }

    session.lastActivity = new Date()

    // Processar baseado no step atual
    switch (session.step) {
      case 0:
        return this.handleWelcome(session)
      
      case 1:
        return this.handleUnitSelection(session, message)
      
      case 2:
        return this.handleNameCollection(session, message)
      
      case 3:
        return this.handlePhoneCollection(session, message, contact)
      
      case 4:
        return this.handleCityCollection(session, message)
      
      case 5:
        return this.handleProjectCollection(session, message)
      
      case 6:
        return this.handleEnvironmentCollection(session, message)
      
      case 7:
        return this.handleCalendarConfirmation(session, message)
      
      default:
        return this.handleCompletion(session)
    }
  }

  private handleWelcome(session: UserSession): ProcessResult {
    session.step = 1
    
    return {
      message: `Olá, seja bem-vindo(a) à **Casa Demovélli**! ✨

Eu sou a **Clara**, assistente virtual da nossa equipe.

Para começar, me diga:
📍 Você prefere falar com a nossa unidade de **Ijui - RS** ou de **Catuipe - RS**?

Digite:
1️⃣ para Ijui
2️⃣ para Catuipe`
    }
  }

  private handleUnitSelection(session: UserSession, message: string): ProcessResult {
    const normalizedMessage = message.toLowerCase().trim()
    
    if (normalizedMessage.includes('ijui') || normalizedMessage === '1') {
      session.data.unidade = 'Ijui'
    } else if (normalizedMessage.includes('catuipe') || normalizedMessage === '2') {
      session.data.unidade = 'Catuipe'
    } else {
      return {
        message: `Por favor, escolha uma das opções:

1️⃣ para **Ijui - RS**
2️⃣ para **Catuipe - RS**`
      }
    }

    session.step = 2
    
    return {
      message: `Perfeito! Vou te conectar com nossa unidade de **${session.data.unidade}**! 🎉

Agora preciso de algumas informações básicas:

Qual é o seu **nome completo**?`
    }
  }

  private handleNameCollection(session: UserSession, message: string): ProcessResult {
    if (message.length < 2) {
      return {
        message: 'Por favor, me informe seu nome completo:'
      }
    }

    session.data.nome = message.trim()
    session.step = 3

    return {
      message: `Prazer em conhecê-lo(a), **${session.data.nome}**! 😊

Qual é o seu **telefone de contato**? 
(confirme se este número do WhatsApp está correto)`
    }
  }

  private handlePhoneCollection(session: UserSession, message: string, contact: { name: string, number: string }): ProcessResult {
    // Se o usuário confirmar que é o mesmo número
    if (message.toLowerCase().includes('sim') || message.toLowerCase().includes('este') || message.toLowerCase().includes('correto')) {
      session.data.telefone = contact.number
    } else {
      // Extrair número da mensagem
      const phoneRegex = /[\d\s\(\)\-\+]+/g
      const phoneMatch = message.match(phoneRegex)
      
      if (phoneMatch) {
        session.data.telefone = phoneMatch[0].trim()
      } else {
        session.data.telefone = message.trim()
      }
    }

    session.step = 4

    return {
      message: `Telefone registrado: **${session.data.telefone}** ✅

De qual **cidade** você está falando?`
    }
  }

  private handleCityCollection(session: UserSession, message: string): ProcessResult {
    session.data.cidade = message.trim()
    session.step = 5

    return {
      message: `Cidade registrada: **${session.data.cidade}** 📍

Você já possui um **projeto com arquiteto(a)** ou deseja que nossa equipe desenvolva um **novo projeto exclusivo** para você?

Digite:
1️⃣ Já tenho projeto com arquiteto
2️⃣ Preciso de um novo projeto Demovélli`
    }
  }

  private handleProjectCollection(session: UserSession, message: string): ProcessResult {
    const normalizedMessage = message.toLowerCase().trim()
    
    if (normalizedMessage.includes('tenho') || normalizedMessage === '1') {
      session.data.projeto = 'Já tenho projeto com arquiteto'
    } else if (normalizedMessage.includes('novo') || normalizedMessage.includes('preciso') || normalizedMessage === '2') {
      session.data.projeto = 'Preciso de um novo projeto Demovélli'
    } else {
      return {
        message: `Por favor, escolha uma das opções:

1️⃣ Já tenho projeto com arquiteto
2️⃣ Preciso de um novo projeto Demovélli`
      }
    }

    session.step = 6

    return {
      message: `Projeto: **${session.data.projeto}** 🏗️

Qual **ambiente** você deseja planejar?

1️⃣ Cozinha
2️⃣ Sala  
3️⃣ Quarto
4️⃣ Banheiro
5️⃣ Escritório
6️⃣ Outro`
    }
  }

  private handleEnvironmentCollection(session: UserSession, message: string): ProcessResult {
    const normalizedMessage = message.toLowerCase().trim()
    
    const environments = {
      '1': 'Cozinha',
      '2': 'Sala',
      '3': 'Quarto', 
      '4': 'Banheiro',
      '5': 'Escritório',
      '6': 'Outro'
    }

    // Verificar se é um número
    if (environments[normalizedMessage as keyof typeof environments]) {
      session.data.ambiente = environments[normalizedMessage as keyof typeof environments]
    } else {
      // Verificar se contém palavra-chave
      for (const [key, value] of Object.entries(environments)) {
        if (normalizedMessage.includes(value.toLowerCase())) {
          session.data.ambiente = value
          break
        }
      }
      
      // Se não encontrou, usar a resposta como está
      if (!session.data.ambiente) {
        session.data.ambiente = message.trim()
      }
    }

    session.step = 7

    return {
      message: `Ambiente: **${session.data.ambiente}** 🏠

Deseja que eu registre um **aviso para nossa equipe** entrar em contato e agendar uma visita à loja/fábrica?

Digite:
✅ Sim, quero que entrem em contato
❌ Não, apenas registrar os dados`
    }
  }

  private handleCalendarConfirmation(session: UserSession, message: string): ProcessResult {
    const normalizedMessage = message.toLowerCase().trim()
    const wantsContact = normalizedMessage.includes('sim') || normalizedMessage.includes('✅') || normalizedMessage.includes('quero')

    session.step = 8

    const leadData = {
      ...session.data,
      data: new Date().toISOString(),
      status: 'novo',
      wantsContact
    }

    // Limpar sessão
    this.sessions.delete(session.data.telefone || '')

    return {
      message: `Obrigada pelas informações, **${session.data.nome}**! 🎉

Já registrei seus dados e vou encaminhar para a nossa unidade de **${session.data.unidade}**.

${wantsContact ? 
  'Nossa equipe foi notificada e entrará em contato em breve para agendar sua visita! 📅' : 
  'Seus dados foram registrados com sucesso! 📝'
}

Em breve, um de nossos especialistas da Casa Demovélli entrará em contato para dar continuidade ao seu projeto. ❤️

Tenha um ótimo dia!`,
      completed: true,
      leadData,
      forwardToUnit: session.data.unidade
    }
  }

  private handleCompletion(session: UserSession): ProcessResult {
    return {
      message: `Olá! Seu atendimento já foi finalizado. 

Se precisar de um novo atendimento, digite qualquer mensagem para começar novamente! 😊`
    }
  }

  private cleanOldSessions(): void {
    const now = new Date()
    const maxAge = 2 * 60 * 60 * 1000 // 2 horas

    for (const [chatId, session] of this.sessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > maxAge) {
        this.sessions.delete(chatId)
      }
    }
  }
}