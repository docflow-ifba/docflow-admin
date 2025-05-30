import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AISettingsPage() {
  const [temperature, setTemperature] = useState([0.7])
  // const [maxTokens, setMaxTokens] = useState([1024])
  // const [autoTrain, setAutoTrain] = useState(true)
  // const [feedbackCollection, setFeedbackCollection] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Configurações da IA</h2>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Alterações nas configurações da IA podem afetar o desempenho e a qualidade das respostas. Teste
          cuidadosamente antes de aplicar em produção.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="model" className="space-y-4">
        <TabsList>
          <TabsTrigger value="model">Modelo</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros do Modelo</CardTitle>
              <CardDescription>Ajuste fino dos parâmetros da IA para melhor desempenho</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-selection">Modelo de IA</Label>
                <Select defaultValue="gpt-4o">
                  <SelectTrigger id="model-selection">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="mistral-large">Mistral Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API</Label>
                <Input id="api-key" type="password" value="••••••••••••••••••••••" />
                <p className="text-xs text-muted-foreground">Sua chave está criptografada e armazenada com segurança</p>
              </div> */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperatura: {temperature[0].toFixed(1)}</Label>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={temperature}
                  onValueChange={setTemperature}
                />
                <p className="text-xs text-muted-foreground">
                  Controla a aleatoriedade: valores baixos geram respostas mais determinísticas, valores altos mais criativas
                </p>
              </div>

              {/* <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Máximo de Tokens: {maxTokens[0]}</Label>
                </div>
                <Slider
                  id="max-tokens"
                  min={256}
                  max={4096}
                  step={128}
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                />
                <p className="text-xs text-muted-foreground">Comprimento máximo da resposta gerada</p>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="context-window">Janela de Contexto</Label>
                <Select defaultValue="8192">
                  <SelectTrigger id="context-window">
                    <SelectValue placeholder="Selecione a janela de contexto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4096">4.096 tokens</SelectItem>
                    <SelectItem value="8192">8.192 tokens</SelectItem>
                    <SelectItem value="16384">16.384 tokens</SelectItem>
                    <SelectItem value="32768">32.768 tokens</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Tamanho máximo de contexto para cada consulta</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompts do Sistema</CardTitle>
              <CardDescription>Configure os prompts que guiam o comportamento da IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">Prompt Principal</Label>
                <Textarea
                  id="system-prompt"
                  rows={6}
                  defaultValue="Você é um assistente de IA para o sistema de editais acadêmicos de uma universidade. Seu objetivo é ajudar os estudantes a encontrarem informações sobre editais, prazos, eventos e políticas acadêmicas. Sempre seja útil, preciso e conciso. Se não souber a resposta, diga claramente e sugira onde o estudante pode encontrar a informação."
                />
                <p className="text-xs text-muted-foreground">Esse prompt define o papel e o comportamento da IA</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback-prompt">Resposta Alternativa</Label>
                <Textarea
                  id="fallback-prompt"
                  rows={3}
                  defaultValue="Não tenho informações suficientes para responder com precisão. Você pode verificar o site oficial da universidade ou entrar em contato com o setor responsável para obter informações atualizadas."
                />
                <p className="text-xs text-muted-foreground">Resposta quando a IA não consegue responder a uma pergunta</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting-prompt">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="greeting-prompt"
                  rows={2}
                  defaultValue="Olá! Sou o assistente de editais acadêmicos da sua universidade. Como posso te ajudar hoje?"
                />
                <p className="text-xs text-muted-foreground">Mensagem inicial exibida aos usuários</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

