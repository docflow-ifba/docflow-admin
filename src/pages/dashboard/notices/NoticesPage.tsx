import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { findNotices, createNotice, deleteNotice } from "@/services/notice.service";
import { CreateNoticeDTO } from "@/dtos/create-notice.dto";
import { NoticeResponseDTO } from "@/dtos/notice-response.dto";
import OrganizationsAutocomplete from "@/components/organizations-autocomplete";

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNotice, setNewNotice] = useState<CreateNoticeDTO>({
    title: "",
    deadline: "",
    pdfBase64: "",
    organization_id: "",
  });

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesData = await findNotices(statusFilter, searchTerm, organizationFilter);
        setNotices(noticesData);
      } catch (error) {
        console.error("Erro ao buscar editais:", error);
      }
    };

    fetchNotices();
  }, [statusFilter, searchTerm, organizationFilter]);

  const handleAddNotice = async () => {
    try {
      await createNotice(newNotice);
      setIsAddDialogOpen(false);
      const updated = await findNotices(statusFilter, searchTerm, organizationFilter);
      setNotices(updated);
    } catch (err) {
      console.error("Erro ao adicionar aviso:", err);
    }
  };

  const handleEditNotice = async (noticeId: string) => {
    console.log(noticeId)
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      await deleteNotice(noticeId);
      const updated = await findNotices(statusFilter, searchTerm, organizationFilter);
      setNotices(updated);
    } catch (err) {
      console.error("Erro ao excluir aviso:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewNotice((prev) => ({
        ...prev,
        pdfBase64: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

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
                <Label htmlFor="deadline">Data Final</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newNotice.deadline}
                  onChange={(e) => setNewNotice({ ...newNotice, deadline: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization_id">Instituição</Label>
                <OrganizationsAutocomplete
                  id="organization_id"
                  value={newNotice.organization_id}
                  onChange={(e) => setNewNotice({ ...newNotice, organization_id: e.organizationId })}
                  placeholder="Digite o ID da instituição"
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
                  Nenhum aviso encontrado.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.noticeId}>
                  <TableCell>{notice.title}</TableCell>
                  <TableCell>{notice.deadline.toISOString()}</TableCell>
                  <TableCell>{notice.status}</TableCell>
                  <TableCell>{notice.organizationId}</TableCell>
                  <TableCell>{notice.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleEditNotice(notice.noticeId)}><Edit className="h-4 w-4" /></Button>
                      <Button onClick={() => handleDeleteNotice(notice.noticeId)}><Trash2 className="h-4 w-4" /></Button>
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
