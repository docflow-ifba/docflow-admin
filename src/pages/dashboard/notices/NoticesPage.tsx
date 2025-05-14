import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Search, Trash2 } from "lucide-react"

const initialNotices = [
  {
    id: "1",
    title: "Prazo de Matrícula para o Semestre de Outono",
    category: "Matrícula",
    status: "Ativo",
    date: "2025-08-15",
    views: 1245,
  },
  {
    id: "2",
    title: "Horário da Biblioteca Estendido Durante a Semana de Provas Finais",
    category: "Instalações",
    status: "Ativo",
    date: "2025-05-10",
    views: 876,
  },
  {
    id: "3",
    title: "Período de Inscrição para Bolsas de Estudo Aberto",
    category: "Financeiro",
    status: "Ativo",
    date: "2025-03-01",
    views: 2134,
  },
  {
    id: "4",
    title: "Fechamento do Campus Devido ao Clima",
    category: "Emergência",
    status: "Inativo",
    date: "2025-01-15",
    views: 3421,
  },
  {
    id: "5",
    title: "Novas Ofertas de Cursos para o Semestre da Primavera",
    category: "Acadêmico",
    status: "Ativo",
    date: "2025-02-20",
    views: 987,
  },
  {
    id: "6",
    title: "Eleições do Grêmio Estudantil",
    category: "Eventos",
    status: "Ativo",
    date: "2025-04-05",
    views: 654,
  },
  {
    id: "7",
    title: "Inscrições Abertas para Feira de Carreiras",
    category: "Carreira",
    status: "Ativo",
    date: "2025-03-15",
    views: 1432,
  },
]

export default function NoticesPage() {
  const [notices, setNotices] = useState(initialNotices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentNotice, setCurrentNotice] = useState<any>(null)
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "Acadêmico",
    content: "",
  })

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || notice.status === statusFilter
    const matchesCategory = categoryFilter === "all" || notice.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleAddNotice = () => {
    const id = (notices.length + 1).toString()
    const newNoticeItem = {
      id,
      title: newNotice.title,
      category: newNotice.category,
      status: "Ativo",
      date: new Date().toISOString().split("T")[0],
      views: 0,
    }
    setNotices([...notices, newNoticeItem])
    setNewNotice({ title: "", category: "Acadêmico", content: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditNotice = () => {
    if (!currentNotice) return

    const updatedNotices = notices.map((notice) =>
      notice.id === currentNotice.id
        ? { ...notice, title: currentNotice.title, category: currentNotice.category }
        : notice,
    )

    setNotices(updatedNotices)
    setIsEditDialogOpen(false)
  }

  const handleDeleteNotice = () => {
    if (!currentNotice) return

    const updatedNotices = notices.filter((notice) => notice.id !== currentNotice.id)

    setNotices(updatedNotices)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Editais</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Edital
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Edital</DialogTitle>
              <DialogDescription>Crie um novo edital para ser adicionado ao sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Digite o título do aviso"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={newNotice.category}
                  onValueChange={(value) => setNewNotice({ ...newNotice, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acadêmico">Acadêmico</SelectItem>
                    <SelectItem value="Matrícula">Matrícula</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Eventos">Eventos</SelectItem>
                    <SelectItem value="Instalações">Instalações</SelectItem>
                    <SelectItem value="Emergência">Emergência</SelectItem>
                    <SelectItem value="Carreira">Carreira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Digite o conteúdo do aviso"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddNotice}>Adicionar Aviso</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar avisos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Acadêmico">Acadêmico</SelectItem>
              <SelectItem value="Matrícula">Matrícula</SelectItem>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Eventos">Eventos</SelectItem>
              <SelectItem value="Instalações">Instalações</SelectItem>
              <SelectItem value="Emergência">Emergência</SelectItem>
              <SelectItem value="Carreira">Carreira</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum aviso encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredNotices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>{notice.category}</TableCell>
                  <TableCell>
                    <Badge variant={notice.status === "Ativo" ? "default" : "secondary"}>{notice.status}</Badge>
                  </TableCell>
                  <TableCell>{notice.date}</TableCell>
                  <TableCell>{notice.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentNotice?.id === notice.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (open) setCurrentNotice(notice)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Aviso</DialogTitle>
                            <DialogDescription>Faça alterações nos detalhes do aviso.</DialogDescription>
                          </DialogHeader>
                          {currentNotice && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-title">Título</Label>
                                <Input
                                  id="edit-title"
                                  value={currentNotice.title}
                                  onChange={(e) =>
                                    setCurrentNotice({
                                      ...currentNotice,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-category">Categoria</Label>
                                <Select
                                  value={currentNotice.category}
                                  onValueChange={(value) =>
                                    setCurrentNotice({
                                      ...currentNotice,
                                      category: value,
                                    })
                                  }
                                >
                                  <SelectTrigger id="edit-category">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Acadêmico">Acadêmico</SelectItem>
                                    <SelectItem value="Matrícula">Matrícula</SelectItem>
                                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                                    <SelectItem value="Eventos">Eventos</SelectItem>
                                    <SelectItem value="Instalações">Instalações</SelectItem>
                                    <SelectItem value="Emergência">Emergência</SelectItem>
                                    <SelectItem value="Carreira">Carreira</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                  value={currentNotice.status}
                                  onValueChange={(value) =>
                                    setCurrentNotice({
                                      ...currentNotice,
                                      status: value,
                                    })
                                  }
                                >
                                  <SelectTrigger id="edit-status">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleEditNotice}>Salvar Alterações</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && currentNotice?.id === notice.id}
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open)
                          if (open) setCurrentNotice(notice)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Excluir Aviso</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          {currentNotice && (
                            <div className="py-4">
                              <p className="font-medium">{currentNotice.title}</p>
                              <p className="text-sm text-muted-foreground">Categoria: {currentNotice.category}</p>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteNotice}>
                              Excluir
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}