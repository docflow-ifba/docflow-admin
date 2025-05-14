import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RecentNoticesTable() {
  const recentNotices = [
    {
      id: "1",
      title: "Fall Semester Registration Deadline",
      category: "Registration",
      status: "Active",
      date: "2025-08-15",
    },
    {
      id: "2",
      title: "Library Hours Extended During Finals Week",
      category: "Facilities",
      status: "Active",
      date: "2025-05-10",
    },
    {
      id: "3",
      title: "Scholarship Application Period Open",
      category: "Financial",
      status: "Active",
      date: "2025-03-01",
    },
    {
      id: "4",
      title: "Campus Closure Due to Weather",
      category: "Emergency",
      status: "Inactive",
      date: "2025-01-15",
    },
    {
      id: "5",
      title: "New Course Offerings for Spring Semester",
      category: "Academic",
      status: "Active",
      date: "2025-02-20",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentNotices.map((notice) => (
          <TableRow key={notice.id}>
            <TableCell className="font-medium">{notice.title}</TableCell>
            <TableCell>{notice.category}</TableCell>
            <TableCell>
              <Badge variant={notice.status === "Active" ? "default" : "secondary"}>{notice.status}</Badge>
            </TableCell>
            <TableCell>{notice.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
