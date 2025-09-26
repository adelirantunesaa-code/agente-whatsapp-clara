import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

export class GoogleSheetsService {
  private sheets: any
  private auth: any

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      // Carregar credenciais do Google (você precisa configurar isso)
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json')
      
      if (fs.existsSync(credentialsPath)) {
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
        
        this.auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })

        this.sheets = google.sheets({ version: 'v4', auth: this.auth })
      } else {
        console.log('Arquivo de credenciais do Google não encontrado. Criando arquivo de exemplo...')
        this.createCredentialsExample()
      }
    } catch (error) {
      console.error('Erro ao inicializar Google Sheets:', error)
    }
  }

  private createCredentialsExample() {
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

    const credentialsPath = path.join(process.cwd(), 'google-credentials.json')
    fs.writeFileSync(credentialsPath, JSON.stringify(exampleCredentials, null, 2))
    
    console.log('Arquivo google-credentials.json criado. Configure suas credenciais do Google Cloud.')
  }

  public async addLead(leadData: any): Promise<void> {
    try {
      if (!this.sheets) {
        console.log('Google Sheets não configurado')
        return
      }

      // Carregar configurações
      const configPath = path.join(process.cwd(), 'config.json')
      if (!fs.existsSync(configPath)) {
        console.log('Arquivo de configuração não encontrado')
        return
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      if (!config.googleSheetsId) {
        console.log('ID do Google Sheets não configurado')
        return
      }

      // Preparar dados para inserção
      const values = [
        [
          new Date().toLocaleString('pt-BR'),
          leadData.nome,
          leadData.telefone,
          leadData.cidade,
          leadData.projeto,
          leadData.ambiente,
          leadData.unidade,
          leadData.status || 'novo'
        ]
      ]

      // Inserir no Google Sheets
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: config.googleSheetsId,
        range: 'Leads Casa Demovélli!A:H',
        valueInputOption: 'RAW',
        resource: {
          values
        }
      })

      console.log('Lead adicionado ao Google Sheets:', leadData.nome)
    } catch (error) {
      console.error('Erro ao adicionar lead ao Google Sheets:', error)
    }
  }

  public async createSheet(spreadsheetId: string): Promise<void> {
    try {
      if (!this.sheets) {
        console.log('Google Sheets não configurado')
        return
      }

      // Criar cabeçalhos
      const headers = [
        ['Data', 'Nome', 'Telefone', 'Cidade', 'Projeto', 'Ambiente', 'Unidade', 'Status']
      ]

      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Leads Casa Demovélli!A1:H1',
        valueInputOption: 'RAW',
        resource: {
          values: headers
        }
      })

      console.log('Planilha configurada com sucesso')
    } catch (error) {
      console.error('Erro ao configurar planilha:', error)
    }
  }
}