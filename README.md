# 🤖 Clara - Agente IA Casa Demovélli

Assistente virtual inteligente para atendimento e triagem de clientes via WhatsApp.

## 🚀 Funcionalidades

### 🎯 Atendimento Automatizado
- **Saudação acolhedora** no estilo família Casa Demovélli
- **Triagem inteligente** para identificar unidade desejada (Ijui ou Catuipe)
- **Coleta estruturada** de dados do cliente
- **Fluxo conversacional** natural e humanizado

### 📊 Integrações Completas
- **Google Sheets**: Registro automático de todos os leads
- **Google Calendar**: Criação de avisos para equipe de atendimento
- **WhatsApp Business**: Encaminhamento para unidades específicas
- **Dashboard Web**: Monitoramento em tempo real

### 🔄 Fluxo da Conversa

1. **Saudação**: "Olá, seja bem-vindo(a) à Casa Demovélli! ✨"
2. **Escolha da Unidade**: Ijui-RS ou Catuipe-RS
3. **Coleta de Dados**:
   - Nome completo
   - Telefone de contato
   - Cidade
   - Tipo de projeto (com arquiteto ou novo projeto Demovélli)
   - Ambiente desejado (cozinha, sala, quarto, etc.)
4. **Confirmação de Contato**: Deseja agendamento de visita?
5. **Finalização**: Registro + Encaminhamento + Despedida

## ⚙️ Configuração

### 1. WhatsApp Business
- Conecte sua conta WhatsApp Business
- Escaneie o QR Code na aba "WhatsApp"
- Clara ficará ativa 24/7

### 2. Google Sheets
1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a API do Google Sheets
3. Crie uma conta de serviço
4. Baixe o arquivo JSON de credenciais
5. Renomeie para `google-credentials.json` na raiz do projeto
6. Configure o ID da planilha nas configurações

### 3. Google Calendar
1. No mesmo projeto do Google Cloud
2. Ative a API do Google Calendar
3. Use as mesmas credenciais do Sheets
4. Configure o ID do calendário (use "primary" para o principal)

### 4. Números das Unidades
- Configure os números WhatsApp das unidades Ijui e Catuipe
- Clara encaminhará os leads automaticamente

## 📱 Como Usar

### Para Administradores
1. Acesse o dashboard web
2. Conecte o WhatsApp na aba "WhatsApp"
3. Configure as integrações na aba "Configurações"
4. Monitore os leads na aba "Leads"

### Para Clientes
1. Envie mensagem para o WhatsApp central
2. Clara responderá automaticamente
3. Siga o fluxo de perguntas
4. Aguarde contato da equipe

## 🛠️ Tecnologias

- **Next.js 15** - Framework web
- **WhatsApp Web.js** - Integração WhatsApp
- **Google APIs** - Sheets e Calendar
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Interface moderna

## 📋 Estrutura de Dados

### Lead Capturado
```json
{
  "nome": "Maria Silva",
  "telefone": "+5551999887766",
  "cidade": "Ijui",
  "projeto": "Novo projeto Demovélli",
  "ambiente": "Cozinha",
  "unidade": "Ijui",
  "status": "novo",
  "data": "2024-01-15T10:30:00Z"
}
```

### Status dos Leads
- **novo**: Lead recém capturado
- **contatado**: Equipe já fez primeiro contato
- **agendado**: Visita agendada
- **finalizado**: Atendimento concluído

## 🔒 Segurança

- Credenciais Google armazenadas localmente
- Sessões WhatsApp criptografadas
- Dados sensíveis não expostos na interface
- Limpeza automática de sessões antigas

## 📞 Suporte

Para configuração e suporte técnico:
- Verifique os logs no console
- Teste as integrações individualmente
- Confirme as credenciais do Google
- Valide os números das unidades

## 🎨 Personalização

### Mensagens da Clara
Edite o arquivo `src/lib/clara-ai.ts` para personalizar:
- Saudações e despedidas
- Perguntas do fluxo
- Tons e emojis
- Validações de entrada

### Interface Visual
Modifique `src/app/page.tsx` para ajustar:
- Cores e temas
- Layout dos cards
- Estatísticas exibidas
- Funcionalidades do dashboard

---

**Clara está pronta para revolucionar o atendimento da Casa Demovélli! 🏠✨**