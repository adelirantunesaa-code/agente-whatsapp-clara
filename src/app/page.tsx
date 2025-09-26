'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Users, Calendar, FileSpreadsheet, Settings, Phone, MapPin, User, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Lead {
  id: string
  nome: string
  telefone: string
  cidade: string
  projeto: string
  ambiente: string
  unidade: string
  status: 'novo' | 'contatado' | 'agendado' | 'finalizado'
  data: string
}

interface WhatsAppStatus {
  connected: boolean
  qrCode?: string
  clientInfo?: {
    name: string
    number: string
  }
}

export default function CasaDemovelliAgent() {
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({ connected: false })
  const [leads, setLeads] = useState<Lead[]>([])
  const [config, setConfig] = useState({
    ijuiNumber: '',
    catuipeNumber: '',
    googleSheetsId: '',
    googleCalendarId: ''
  })
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsHoje: 0,
    leadsIjui: 0,
    leadsCatuipe: 0
  })

  useEffect(() => {
    // Simular dados iniciais
    const mockLeads: Lead[] = [
      {
        id: '1',
        nome: 'Maria Silva',
        telefone: '+5551999887766',
        cidade: 'Ijui',
        projeto: 'Novo projeto Demovélli',
        ambiente: 'Cozinha',
        unidade: 'Ijui',
        status: 'novo',
        data: new Date().toISOString()
      },
      {
        id: '2',
        nome: 'João Santos',
        telefone: '+5551888776655',
        cidade: 'Catuipe',
        projeto: 'Já tenho projeto com arquiteto',
        ambiente: 'Sala',
        unidade: 'Catuipe',
        status: 'contatado',
        data: new Date().toISOString()
      }
    ]
    
    setLeads(mockLeads)
    setStats({
      totalLeads: mockLeads.length,
      leadsHoje: mockLeads.filter(lead => 
        new Date(lead.data).toDateString() === new Date().toDateString()
      ).length,
      leadsIjui: mockLeads.filter(lead => lead.unidade === 'Ijui').length,
      leadsCatuipe: mockLeads.filter(lead => lead.unidade === 'Catuipe').length
    })
  }, [])

  const connectWhatsApp = async () => {
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setWhatsappStatus({ connected: true, clientInfo: data.clientInfo })
        toast.success('WhatsApp conectado com sucesso!')
      } else {
        setWhatsappStatus({ connected: false, qrCode: data.qrCode })
        toast.info('Escaneie o QR Code para conectar')
      }
    } catch (error) {
      toast.error('Erro ao conectar WhatsApp')
    }
  }

  const disconnectWhatsApp = async () => {
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' })
      setWhatsappStatus({ connected: false })
      toast.success('WhatsApp desconectado')
    } catch (error) {
      toast.error('Erro ao desconectar WhatsApp')
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ))
    toast.success('Status atualizado!')
  }

  const saveConfig = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      toast.success('Configurações salvas!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    }
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'novo': return 'bg-blue-500'
      case 'contatado': return 'bg-yellow-500'
      case 'agendado': return 'bg-green-500'
      case 'finalizado': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'novo': return <AlertCircle className="w-4 h-4" />
      case 'contatado': return <Clock className="w-4 h-4" />
      case 'agendado': return <Calendar className="w-4 h-4" />
      case 'finalizado': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Clara - Agente IA Casa Demovélli
          </h1>
          <p className="text-lg text-gray-600">
            Assistente virtual para atendimento e triagem de clientes via WhatsApp
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadsHoje}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidade Ijui</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadsIjui}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidade Catuipe</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadsCatuipe}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Status do WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${whatsappStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="font-medium">
                        {whatsappStatus.connected ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    {whatsappStatus.connected ? (
                      <Button variant="outline" onClick={disconnectWhatsApp}>
                        Desconectar
                      </Button>
                    ) : (
                      <Button onClick={connectWhatsApp}>
                        Conectar
                      </Button>
                    )}
                  </div>
                  {whatsappStatus.clientInfo && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Conectado como:</strong> {whatsappStatus.clientInfo.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {whatsappStatus.clientInfo.number}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    Integrações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Google Sheets</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Google Calendar</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Encaminhamento WhatsApp</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>Conexão WhatsApp</CardTitle>
                <CardDescription>
                  Gerencie a conexão do agente Clara com o WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {whatsappStatus.qrCode && (
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">QR Code aqui</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      Escaneie este QR Code com o WhatsApp para conectar
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Como funciona a Clara:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Recebe mensagens no WhatsApp central da Casa Demovélli</li>
                    <li>• Faz triagem acolhedora identificando a unidade desejada</li>
                    <li>• Coleta dados básicos do cliente (nome, telefone, cidade, projeto)</li>
                    <li>• Registra automaticamente no Google Sheets</li>
                    <li>• Cria aviso no Google Calendar para a equipe</li>
                    <li>• Encaminha o cliente para o WhatsApp da unidade escolhida</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Leads</CardTitle>
                <CardDescription>
                  Acompanhe e gerencie todos os leads capturados pela Clara
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-500" />
                          <div>
                            <h3 className="font-semibold">{lead.nome}</h3>
                            <p className="text-sm text-gray-600">{lead.cidade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusIcon(lead.status)}
                            <span className="ml-1 capitalize">{lead.status}</span>
                          </Badge>
                          <Badge variant="outline">
                            {lead.unidade}
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Telefone:</span>
                          <p className="text-gray-600">{lead.telefone}</p>
                        </div>
                        <div>
                          <span className="font-medium">Projeto:</span>
                          <p className="text-gray-600">{lead.projeto}</p>
                        </div>
                        <div>
                          <span className="font-medium">Ambiente:</span>
                          <p className="text-gray-600">{lead.ambiente}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateLeadStatus(lead.id, 'contatado')}
                          disabled={lead.status !== 'novo'}
                        >
                          Marcar como Contatado
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateLeadStatus(lead.id, 'agendado')}
                          disabled={lead.status === 'finalizado'}
                        >
                          Marcar como Agendado
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateLeadStatus(lead.id, 'finalizado')}
                        >
                          Finalizar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações
                </CardTitle>
                <CardDescription>
                  Configure as integrações e números das unidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Números das Unidades</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="ijui">WhatsApp Unidade Ijui</Label>
                        <Input
                          id="ijui"
                          placeholder="+55XXXXXXXXXXX"
                          value={config.ijuiNumber}
                          onChange={(e) => setConfig(prev => ({ ...prev, ijuiNumber: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="catuipe">WhatsApp Unidade Catuipe</Label>
                        <Input
                          id="catuipe"
                          placeholder="+55XXXXXXXXXXX"
                          value={config.catuipeNumber}
                          onChange={(e) => setConfig(prev => ({ ...prev, catuipeNumber: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Integrações Google</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="sheets">ID do Google Sheets</Label>
                        <Input
                          id="sheets"
                          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                          value={config.googleSheetsId}
                          onChange={(e) => setConfig(prev => ({ ...prev, googleSheetsId: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="calendar">ID do Google Calendar</Label>
                        <Input
                          id="calendar"
                          placeholder="primary"
                          value={config.googleCalendarId}
                          onChange={(e) => setConfig(prev => ({ ...prev, googleCalendarId: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Fluxo da Conversa Clara:</h3>
                  <div className="text-sm text-amber-800 space-y-2">
                    <p><strong>1. Saudação:</strong> "Olá, seja bem-vindo(a) à Casa Demovélli! ✨"</p>
                    <p><strong>2. Escolha da Unidade:</strong> Ijui-RS ou Catuipe-RS</p>
                    <p><strong>3. Coleta de Dados:</strong> Nome, telefone, cidade, projeto, ambiente</p>
                    <p><strong>4. Confirmação:</strong> Registro no Sheets + Calendar + Encaminhamento</p>
                    <p><strong>5. Despedida:</strong> "Em breve nossa equipe entrará em contato! ❤️"</p>
                  </div>
                </div>

                <Button onClick={saveConfig} className="w-full">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}