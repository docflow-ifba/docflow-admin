import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash2, Search } from "lucide-react";
import { findOrganizations, createOrganization, updateOrganization, deleteOrganization } from "@/services/organization.service";
import { Organization } from "@/dtos/organization";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization>({ name: "" });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await findOrganizations(searchTerm);
        setOrganizations(data);
      } catch (error) {
        console.error("Erro ao buscar instituições:", error);
      }
    };
    fetchOrganizations();
  }, [searchTerm]);

  const handleSaveOrganization = async () => {
    try {
      if (editingOrgId) {
        await updateOrganization(editingOrgId, currentOrg);
      } else {
        await createOrganization(currentOrg);
      }
      setIsDialogOpen(false);
      setCurrentOrg({ name: "" });
      setEditingOrgId(null);
      const updated = await findOrganizations(searchTerm);
      setOrganizations(updated);
    } catch (err) {
      console.error("Erro ao salvar instituição:", err);
    }
  };

  const handleEditOrganization = (org: Organization) => {
    setCurrentOrg({ name: org.name });
    setEditingOrgId(org.organizationId ?? null);
    setIsDialogOpen(true);
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    try {
      await deleteOrganization(organizationId);
      const updated = await findOrganizations(searchTerm);
      setOrganizations(updated);
    } catch (err) {
      console.error("Erro ao excluir instituição:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Instituições</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setCurrentOrg({ name: "" });
            setEditingOrgId(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setCurrentOrg({ name: "" });
              setEditingOrgId(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Instituição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOrgId ? "Editar Instituição" : "Nova Instituição"}</DialogTitle>
              <DialogDescription>
                {editingOrgId ? "Atualize o nome da instituição." : "Adicione uma nova instituição ao sistema."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Instituição</Label>
                <Input
                  id="name"
                  value={currentOrg.name}
                  onChange={(e) => setCurrentOrg({ ...currentOrg, name: e.target.value })}
                  placeholder="Digite o nome da instituição"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveOrganization}>
                {editingOrgId ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar instituições..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Nenhuma instituição encontrada.
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.organizationId}>
                  <TableCell>{org.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleEditOrganization(org)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteOrganization(org.organizationId!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
