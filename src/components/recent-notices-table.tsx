import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RecentNoticesTable() {
  const recentNotices = [
    {
      id: "1",
      title: "Prazo de Inscrição para o Semestre de Outono",
      category: "Inscrições",
      status: "Ativo",
      date: "2025-08-15",
    },
    {
      id: "2",
      title: "Horário da Biblioteca Estendido Durante a Semana de Provas",
      category: "Infraestrutura",
      status: "Ativo",
      date: "2025-05-10",
    },
    {
      id: "3",
      title: "Período de Inscrição para Bolsas Aberto",
      category: "Financeiro",
      status: "Ativo",
      date: "2025-03-01",
    },
    {
      id: "4",
      title: "Campus Fechado Devido ao Clima",
      category: "Emergência",
      status: "Inativo",
      date: "2025-01-15",
    },
    {
      id: "5",
      title: "Novas Disciplinas Ofertadas para o Semestre de Primavera",
      category: "Acadêmico",
      status: "Ativo",
      date: "2025-02-20",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentNotices.map((notice) => (
          <TableRow key={notice.id}>
            <TableCell className="font-medium">{notice.title}</TableCell>
            <TableCell>{notice.category}</TableCell>
            <TableCell>
              <Badge variant={notice.status === "Ativo" ? "default" : "secondary"}>{notice.status}</Badge>
            </TableCell>
            <TableCell>{notice.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
