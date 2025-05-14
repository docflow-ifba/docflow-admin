"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Bot, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AISettingsPage() {
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([1024])
  const [autoTrain, setAutoTrain] = useState(true)
  const [feedbackCollection, setFeedbackCollection] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">AI System Settings</h2>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Changes to AI settings may affect the system's performance and response quality. Test thoroughly before
          deploying to production.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="model">Model Settings</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="prompts">System Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the general behavior of the AI Q&A system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="feedback-collection">Feedback Collection</Label>
                  <p className="text-sm text-muted-foreground">Allow users to provide feedback on AI responses</p>
                </div>
                <Switch id="feedback-collection" checked={feedbackCollection} onCheckedChange={setFeedbackCollection} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-train">Automatic Training</Label>
                  <p className="text-sm text-muted-foreground">Automatically train the model on new notices</p>
                </div>
                <Switch id="auto-train" checked={autoTrain} onCheckedChange={setAutoTrain} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model-selection">AI Model</Label>
                <Select defaultValue="gpt-4o">
                  <SelectTrigger id="model-selection">
                    <SelectValue placeholder="Select model" />
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

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" value="••••••••••••••••••••••" />
                <p className="text-xs text-muted-foreground">Your API key is encrypted and securely stored</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Parameters</CardTitle>
              <CardDescription>Fine-tune the AI model parameters for optimal performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature: {temperature[0].toFixed(1)}</Label>
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
                  Controls randomness: Lower values are more deterministic, higher values more creative
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Max Tokens: {maxTokens[0]}</Label>
                </div>
                <Slider
                  id="max-tokens"
                  min={256}
                  max={4096}
                  step={128}
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                />
                <p className="text-xs text-muted-foreground">Maximum length of the generated response</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context-window">Context Window</Label>
                <Select defaultValue="8192">
                  <SelectTrigger id="context-window">
                    <SelectValue placeholder="Select context window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4096">4,096 tokens</SelectItem>
                    <SelectItem value="8192">8,192 tokens</SelectItem>
                    <SelectItem value="16384">16,384 tokens</SelectItem>
                    <SelectItem value="32768">32,768 tokens</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Maximum context size for each query</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Configuration</CardTitle>
              <CardDescription>Configure how the AI system learns from new data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="training-frequency">Training Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="training-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-sources">Data Sources</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="source-notices" defaultChecked />
                  <Label htmlFor="source-notices">Academic Notices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="source-qa" defaultChecked />
                  <Label htmlFor="source-qa">Previous Q&A Pairs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="source-feedback" defaultChecked />
                  <Label htmlFor="source-feedback">User Feedback</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Bot className="mr-2 h-4 w-4" />
                  Start Manual Training
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Prompts</CardTitle>
              <CardDescription>Configure the system prompts that guide the AI's behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">Main System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  rows={6}
                  defaultValue="You are an AI assistant for a university's academic notice system. Your purpose is to help students find information about academic notices, deadlines, events, and policies. Always be helpful, accurate, and concise. If you don't know the answer, say so clearly and suggest where the student might find the information."
                />
                <p className="text-xs text-muted-foreground">This prompt defines the AI's role and behavior</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback-prompt">Fallback Response</Label>
                <Textarea
                  id="fallback-prompt"
                  rows={3}
                  defaultValue="I don't have enough information to answer that question accurately. You might want to check the university's official website or contact the relevant department directly for the most up-to-date information."
                />
                <p className="text-xs text-muted-foreground">Response when the AI cannot answer a question</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting-prompt">Greeting Message</Label>
                <Textarea
                  id="greeting-prompt"
                  rows={2}
                  defaultValue="Hello! I'm your university's academic notice assistant. How can I help you today?"
                />
                <p className="text-xs text-muted-foreground">Initial greeting shown to users</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
