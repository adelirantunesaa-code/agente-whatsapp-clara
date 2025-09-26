#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🤖 Configurando Clara - Agente IA Casa Demovélli...\n')

// 1. Criar arquivo de configuração se não existir
const configPath = path.join(process.cwd(), 'config.json')
if (!fs.existsSync(configPath)) {
  const exampleConfig = {
    ijuiNumber: '',
    catuipeNumber: '',
    googleSheetsId: '',
    googleCalendarId: 'primary'
  }
  
  fs.writeFileSync(configPath, JSON.stringify(exampleConfig, null, 2))
  console.log('✅ Arquivo config.json criado')
} else {
  console.log('✅ Arquivo config.json já existe')
}

// 2. Criar arquivo de credenciais do Google se não existir
const credentialsPath = path.join(process.cwd(), 'google-credentials.json')
if (!fs.existsSync(credentialsPath)) {
  const exampleCredentials = {
    "type": "service_account",
    "project_id": "seu-projeto-id",
    "private_key_id": "sua-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nSUA_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
    "client_email": "seu-service-account@seu-projeto.iam.gserviceaccount.com",
    "client_id": "seu-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/seu-service-account%40seu-projeto.iam.gserviceaccount.com"
  }
  
  fs.writeFileSync(credentialsPath, JSON.stringify(exampleCredentials, null, 2))
  console.log('✅ Arquivo google-credentials.json criado (configure suas credenciais)')
} else {
  console.log('✅ Arquivo google-credentials.json já existe')
}

// 3. Criar pasta para sessões do WhatsApp
const sessionsPath = path.join(process.cwd(), '.wwebjs_auth')
if (!fs.existsSync(sessionsPath)) {
  fs.mkdirSync(sessionsPath, { recursive: true })
  console.log('✅ Pasta de sessões WhatsApp criada')
} else {
  console.log('✅ Pasta de sessões WhatsApp já existe')
}

console.log('\n🎉 Configuração inicial concluída!')
console.log('\n📋 Próximos passos:')
console.log('1. Configure os números das unidades em config.json')
console.log('2. Configure suas credenciais do Google em google-credentials.json')
console.log('3. Execute: npm run dev')
console.log('4. Acesse http://localhost:3000')
console.log('5. Conecte o WhatsApp na aba "WhatsApp"')
console.log('\n🚀 Clara estará pronta para atender!')