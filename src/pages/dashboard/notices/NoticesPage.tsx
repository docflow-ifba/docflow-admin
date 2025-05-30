import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Search, Send, Trash2 } from "lucide-react";
import { findNotices, createNotice, updateNotice, deleteNotice, embedNotice } from "@/services/notice.service";
import { CreateNoticeDTO } from "@/dtos/create-notice.dto";
import { NoticeResponseDTO } from "@/dtos/notice-response.dto";
import OrganizationsAutocomplete from "@/components/organizations-autocomplete";
import { formatDate } from "@/utils/date";
import { NoticeStatus, NoticeStatusLabels } from "@/enums/notice-status";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Para diferenciar se está adicionando ou editando:
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  const initialNoticeState = {
    title: "",
    deadline: "",
    pdfBase64: "",
    organization: { name: "" },
  };

  const [currentNotice, setCurrentNotice] = useState<CreateNoticeDTO>(initialNoticeState);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesData = await findNotices({status: statusFilter, title: searchTerm, organizationId: organizationFilter});
        setNotices(noticesData);
      } catch (error) {
        console.error("Erro ao buscar editais:", error);
      }
    };

    fetchNotices();
  }, [statusFilter, searchTerm, organizationFilter]);

  const handleSaveNotice = async () => {
    try {
      if (editingNoticeId) {
        await updateNotice(editingNoticeId, currentNotice);
      } else {
        await createNotice(currentNotice);
      }
      setIsDialogOpen(false);
      setCurrentNotice(initialNoticeState);
      setEditingNoticeId(null);

      const updated = await findNotices({status: statusFilter, title: searchTerm, organizationId: organizationFilter});
      setNotices(updated);
    } catch (err) {
      console.error("Erro ao salvar edital:", err);
    }
  };

  const handleEmbedding = async (notice: NoticeResponseDTO) => {
    setEditingNoticeId(notice.noticeId);
    await embedNotice(notice.noticeId);
  };

  const handleEditNotice = (notice: NoticeResponseDTO) => {
    setCurrentNotice({
      title: notice.title || "",
      deadline: new Date(notice.deadline).toISOString().split("T")[0] || "",
      pdfBase64: "",
      organization: notice.organization || { name: "" },
    });
    setEditingNoticeId(notice.noticeId);
    setIsDialogOpen(true);
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      await deleteNotice(noticeId);
      const updated = await findNotices({status: statusFilter, title: searchTerm, organizationId: organizationFilter});
      setNotices(updated);
    } catch (err) {
      console.error("Erro ao excluir edital:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentNotice((prev) => ({
        ...prev,
        pdfBase64: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const dialogTitle = editingNoticeId ? "Editar Edital" : "Adicionar Novo Edital";
  const dialogDescription = editingNoticeId
    ? "Atualize os dados do edital."
    : "Crie um novo edital para ser adicionado ao sistema.";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Editais</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setCurrentNotice(initialNoticeState);
            setEditingNoticeId(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setCurrentNotice(initialNoticeState);
              setEditingNoticeId(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Edital
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={currentNotice.title}
                  onChange={(e) => setCurrentNotice({ ...currentNotice, title: e.target.value })}
                  placeholder="Digite o título do edital"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Data Final</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={currentNotice.deadline}
                  onChange={(e) => setCurrentNotice({ ...currentNotice, deadline: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization_id">Instituição</Label>
                <OrganizationsAutocomplete
                  id="organization_id"
                  value={currentNotice.organization.name}
                  onChange={(org) => setCurrentNotice({ ...currentNotice, organization: org })}
                  placeholder="Digite o nome da instituição"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pdf">Arquivo PDF</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {editingNoticeId && !currentNotice.pdfBase64 && (
                  <p className="text-sm text-muted-foreground">Envie um novo arquivo para substituir o atual.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNotice}>
                {editingNoticeId ? "Salvar Alterações" : "Adicionar edital"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar editals..."
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
          <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Instituição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="org1">Org 1</SelectItem>
              <SelectItem value="org2">Org 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead>Visualizações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum edital encontrado.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.noticeId}>
                  <TableCell>{notice.title || "Não informado"}</TableCell>
                  <TableCell>{notice.deadline ? formatDate(notice.deadline) : "Não informado"}</TableCell>
                  <TableCell>{notice.status ? NoticeStatusLabels[notice.status] : "Não informado"}</TableCell>
                  <TableCell>{notice.organization?.name || "Não informado"}</TableCell>
                  <TableCell>{notice.views ?? "Não informado"}</TableCell>
                  <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      {notice.status === NoticeStatus.PENDING_EMBEDDING &&
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={() => handleEmbedding(notice)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enviar para embedding</p>
                          </TooltipContent>
                        </Tooltip>
                      }
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleEditNotice(notice)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar edital</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleDeleteNotice(notice.noticeId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir edital</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
