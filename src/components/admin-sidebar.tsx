import { BarChart3, FileText, Home, LogOut, Settings, Users, X, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Link, useLocation } from "react-router-dom"

interface AdminSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Notices",
      icon: FileText,
      href: "/dashboard/notices",
      active: pathname === "/dashboard/notices",
    },
    {
      label: "AI Settings",
      icon: Bot,
      href: "/dashboard/ai-settings",
      active: pathname === "/dashboard/ai-settings",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full w-full flex-col border-r bg-background">
            <div className="flex h-14 items-center border-b px-4">
              <div className="flex items-center gap-2 font-semibold">
                <Bot className="h-6 w-6" />
                <span>Academic Q&A Admin</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                      route.active ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto border-t p-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden h-full w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6" />
            <span>Academic Q&A Admin</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                  route.active ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                }`}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
