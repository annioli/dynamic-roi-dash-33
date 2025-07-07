
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useROIData } from '@/hooks/useROIData';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/dashboard/Header';
import TopNavigation from '@/components/dashboard/TopNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Webhook, Zap, CheckCircle, AlertCircle, Copy, Globe, Code } from 'lucide-react';
import { toast } from 'sonner';

const Integracoes = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addEntry } = useROIData();
  
  // Webhook states
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testData, setTestData] = useState({
    expense: '',
    return: ''
  });
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // API states
  const [apiConfig, setApiConfig] = useState({
    url: '',
    method: 'POST',
    headers: '',
    apiKey: ''
  });
  const [apiTestData, setApiTestData] = useState({
    expense: '',
    return: ''
  });
  const [isTestingApi, setIsTestingApi] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleWebhookTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast.error('Por favor, insira a URL do webhook');
      return;
    }

    if (!testData.expense || !testData.return) {
      toast.error('Por favor, insira os valores de teste');
      return;
    }

    setIsTestingWebhook(true);
    console.log('Testando webhook:', webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          expense: parseFloat(testData.expense),
          return: parseFloat(testData.return),
          timestamp: new Date().toISOString(),
          source: 'nexum-roi-dashboard',
        }),
      });

      // Adicionar dados ao ROI local para demonstração
      await addEntry(parseFloat(testData.expense), parseFloat(testData.return));

      toast.success('Webhook testado com sucesso! Dados adicionados ao ROI.');
      setTestData({ expense: '', return: '' });
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast.error('Erro ao testar o webhook. Verifique a URL e tente novamente.');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleApiTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiConfig.url) {
      toast.error('Por favor, insira a URL da API');
      return;
    }

    if (!apiTestData.expense || !apiTestData.return) {
      toast.error('Por favor, insira os valores de teste');
      return;
    }

    setIsTestingApi(true);
    console.log('Testando API:', apiConfig);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Adicionar cabeçalhos personalizados
      if (apiConfig.headers) {
        try {
          const customHeaders = JSON.parse(apiConfig.headers);
          Object.assign(headers, customHeaders);
        } catch (error) {
          console.warn('Formato de cabeçalhos inválido, usando apenas Content-Type');
        }
      }

      // Adicionar API Key se fornecida
      if (apiConfig.apiKey) {
        headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
      }

      const response = await fetch(apiConfig.url, {
        method: apiConfig.method,
        headers,
        body: JSON.stringify({
          expense: parseFloat(apiTestData.expense),
          return: parseFloat(apiTestData.return),
          timestamp: new Date().toISOString(),
          source: 'nexum-roi-dashboard',
        }),
      });

      if (response.ok) {
        // Adicionar dados ao ROI local para demonstração
        await addEntry(parseFloat(apiTestData.expense), parseFloat(apiTestData.return));
        toast.success('API testada com sucesso! Dados adicionados ao ROI.');
        setApiTestData({ expense: '', return: '' });
      } else {
        toast.error(`Erro na API: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao testar API:', error);
      toast.error('Erro ao testar a API. Verifique a configuração e tente novamente.');
    } finally {
      setIsTestingApi(false);
    }
  };

  const copyWebhookExample = () => {
    const example = `{
  "expense": 1000,
  "return": 1500,
  "timestamp": "${new Date().toISOString()}",
  "source": "external-system"
}`;
    navigator.clipboard.writeText(example);
    toast.success('Exemplo copiado para a área de transferência!');
  };

  const copyApiExample = () => {
    const example = `{
  "Content-Type": "application/json",
  "X-Custom-Header": "value"
}`;
    navigator.clipboard.writeText(example);
    toast.success('Exemplo de cabeçalhos copiado!');
  };

  return (
    <div className="dark min-h-screen bg-black">
      <Header />
      <TopNavigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Integrações</h1>
          <p className="text-slate-400">Configure webhooks ou APIs para automatizar o cálculo do ROI</p>
        </div>

        <Tabs defaultValue="webhook" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="webhook" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Webhook className="h-4 w-4 mr-2" />
              Webhook
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Globe className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webhook" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuração do Webhook */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Webhook className="h-5 w-5" />
                    <span>Webhook para ROI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="webhook-url" className="text-slate-300">URL do Webhook</Label>
                    <Input
                      id="webhook-url"
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      className="bg-slate-800 border-slate-600 text-white mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Cole aqui a URL do webhook do Zapier, Make ou outro serviço
                    </p>
                  </div>

                  <form onSubmit={handleWebhookTest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="test-expense" className="text-slate-300">Investimento (Teste)</Label>
                        <Input
                          id="test-expense"
                          type="number"
                          step="0.01"
                          value={testData.expense}
                          onChange={(e) => setTestData(prev => ({ ...prev, expense: e.target.value }))}
                          placeholder="1000.00"
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="test-return" className="text-slate-300">Retorno (Teste)</Label>
                        <Input
                          id="test-return"
                          type="number"
                          step="0.01"
                          value={testData.return}
                          onChange={(e) => setTestData(prev => ({ ...prev, return: e.target.value }))}
                          placeholder="1500.00"
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      disabled={isTestingWebhook}
                    >
                      {isTestingWebhook ? 'Testando...' : 'Testar Webhook'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Documentação do Webhook */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Formato dos Dados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-slate-300">Estrutura JSON</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyWebhookExample}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={`{
  "expense": 1000,
  "return": 1500,
  "timestamp": "${new Date().toISOString()}",
  "source": "external-system"
}`}
                      readOnly
                      className="bg-slate-800 border-slate-600 text-slate-300 font-mono text-sm"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Campos obrigatórios:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-600">expense</Badge>
                        <span className="text-slate-300 text-sm">Valor investido (número)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600">return</Badge>
                        <span className="text-slate-300 text-sm">Valor de retorno (número)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuração da API */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Configuração da API</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="api-url" className="text-slate-300">URL da API</Label>
                    <Input
                      id="api-url"
                      type="url"
                      value={apiConfig.url}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://api.exemplo.com/roi"
                      className="bg-slate-800 border-slate-600 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="api-method" className="text-slate-300">Método HTTP</Label>
                    <Select value={apiConfig.method} onValueChange={(value) => setApiConfig(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="api-key" className="text-slate-300">API Key (opcional)</Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiConfig.apiKey}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sua-api-key-aqui"
                      className="bg-slate-800 border-slate-600 text-white mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Será enviada como Bearer token no cabeçalho Authorization
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="api-headers" className="text-slate-300">Cabeçalhos Personalizados (JSON)</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyApiExample}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      id="api-headers"
                      value={apiConfig.headers}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, headers: e.target.value }))}
                      placeholder='{"X-Custom-Header": "value"}'
                      className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
                      rows={3}
                    />
                  </div>

                  <form onSubmit={handleApiTest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="api-test-expense" className="text-slate-300">Investimento (Teste)</Label>
                        <Input
                          id="api-test-expense"
                          type="number"
                          step="0.01"
                          value={apiTestData.expense}
                          onChange={(e) => setApiTestData(prev => ({ ...prev, expense: e.target.value }))}
                          placeholder="1000.00"
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="api-test-return" className="text-slate-300">Retorno (Teste)</Label>
                        <Input
                          id="api-test-return"
                          type="number"
                          step="0.01"
                          value={apiTestData.return}
                          onChange={(e) => setApiTestData(prev => ({ ...prev, return: e.target.value }))}
                          placeholder="1500.00"
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white" 
                      disabled={isTestingApi}
                    >
                      {isTestingApi ? 'Testando...' : 'Testar API'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Documentação da API */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Exemplo de Implementação</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Payload Enviado</Label>
                    <Textarea
                      value={`{
  "expense": 1000,
  "return": 1500,
  "timestamp": "${new Date().toISOString()}",
  "source": "nexum-roi-dashboard"
}`}
                      readOnly
                      className="bg-slate-800 border-slate-600 text-slate-300 font-mono text-sm mt-1"
                      rows={7}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Cabeçalhos Automáticos:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-600">Content-Type</Badge>
                        <span className="text-slate-300 text-sm">application/json</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600">Authorization</Badge>
                        <span className="text-slate-300 text-sm">Bearer [SUA_API_KEY] (se fornecida)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Resposta Esperada:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600">200-299</Badge>
                        <span className="text-slate-300 text-sm">Sucesso</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-600">400+</Badge>
                        <span className="text-slate-300 text-sm">Erro (exibido ao usuário)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Integrações Populares */}
        <Card className="bg-slate-900/50 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Integrações Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white">Zapier</h3>
                <p className="text-slate-400 text-sm">
                  Conecte com mais de 5.000 aplicativos através do Zapier
                </p>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Webhook & API
                </Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                  <Webhook className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white">Make (Integromat)</h3>
                <p className="text-slate-400 text-sm">
                  Automação avançada com Make para fluxos complexos
                </p>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Webhook & API
                </Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white">API Personalizada</h3>
                <p className="text-slate-400 text-sm">
                  Integre diretamente com sua própria API ou sistema
                </p>
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  API Completa
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integracoes;
