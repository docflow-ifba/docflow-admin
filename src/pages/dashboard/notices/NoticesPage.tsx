"use client"

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

// Sample data
const initialNotices = [
  {
    id: "1",
    title: "Fall Semester Registration Deadline",
    category: "Registration",
    status: "Active",
    date: "2025-08-15",
    views: 1245,
  },
  {
    id: "2",
    title: "Library Hours Extended During Finals Week",
    category: "Facilities",
    status: "Active",
    date: "2025-05-10",
    views: 876,
  },
  {
    id: "3",
    title: "Scholarship Application Period Open",
    category: "Financial",
    status: "Active",
    date: "2025-03-01",
    views: 2134,
  },
  {
    id: "4",
    title: "Campus Closure Due to Weather",
    category: "Emergency",
    status: "Inactive",
    date: "2025-01-15",
    views: 3421,
  },
  {
    id: "5",
    title: "New Course Offerings for Spring Semester",
    category: "Academic",
    status: "Active",
    date: "2025-02-20",
    views: 987,
  },
  {
    id: "6",
    title: "Student Government Elections",
    category: "Events",
    status: "Active",
    date: "2025-04-05",
    views: 654,
  },
  {
    id: "7",
    title: "Career Fair Registration Open",
    category: "Career",
    status: "Active",
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
    category: "Academic",
    content: "",
  })

  // Filter notices based on search term and filters
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
      status: "Active",
      date: new Date().toISOString().split("T")[0],
      views: 0,
    }
    setNotices([...notices, newNoticeItem])
    setNewNotice({ title: "", category: "Academic", content: "" })
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
        <h2 className="text-2xl font-bold tracking-tight">Notice Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Notice</DialogTitle>
              <DialogDescription>Create a new academic notice to be added to the Q&A system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Enter notice title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newNotice.category}
                  onValueChange={(value) => setNewNotice({ ...newNotice, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Registration">Registration</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Enter notice content"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNotice}>Add Notice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Registration">Registration</SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Facilities">Facilities</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Career">Career</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No notices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredNotices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>{notice.category}</TableCell>
                  <TableCell>
                    <Badge variant={notice.status === "Active" ? "default" : "secondary"}>{notice.status}</Badge>
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
                            <DialogTitle>Edit Notice</DialogTitle>
                            <DialogDescription>Make changes to the notice details.</DialogDescription>
                          </DialogHeader>
                          {currentNotice && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
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
                                <Label htmlFor="edit-category">Category</Label>
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
                                    <SelectItem value="Academic">Academic</SelectItem>
                                    <SelectItem value="Registration">Registration</SelectItem>
                                    <SelectItem value="Financial">Financial</SelectItem>
                                    <SelectItem value="Events">Events</SelectItem>
                                    <SelectItem value="Facilities">Facilities</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                    <SelectItem value="Career">Career</SelectItem>
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
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditNotice}>Save Changes</Button>
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
                            <DialogTitle>Delete Notice</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this notice? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          {currentNotice && (
                            <div className="py-4">
                              <p className="font-medium">{currentNotice.title}</p>
                              <p className="text-sm text-muted-foreground">Category: {currentNotice.category}</p>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteNotice}>
                              Delete
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
