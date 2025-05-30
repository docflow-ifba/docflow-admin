import { AdminSidebar } from "@/components/admin-sidebar"
import { useState } from "react"

import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}

