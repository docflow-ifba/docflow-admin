import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { Building, FileText, LogOut, MessageCircle, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    // {
    //   label: 'Início',
    //   icon: Home,
    //   href: '/app',
    //   active: pathname === '/app',
    // },
    {
      label: 'Chat',
      icon: MessageCircle,
      href: '/app/chat',
      active: pathname === '/app/chat',
    },
    {
      label: 'Editais',
      icon: FileText,
      href: '/app/editais',
      active: pathname === '/app/editais',
    },
    {
      label: 'Instituições',
      icon: Building,
      href: '/app/organizacoes',
      active: pathname === '/app/organizacoes',
    },
    {
      label: 'Configurações',
      icon: Settings,
      href: '/app/configuracoes',
      active: pathname === '/app/configuracoes',
    },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full w-full flex-col border-r bg-background">
            <div className="flex h-14 items-center border-b px-4 justify-center w-full">
              <img className="max-w-52" src="/public/logo/logo.png" alt="Logo do DOCFLOW" />
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                      route.active ? 'bg-muted font-medium text-primary' : 'text-muted-foreground'
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
      <div className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center justify-center w-full gap-2 font-semibold">
            <img className="w-44" src="/public/logo/logo.png" alt="Logo do DOCFLOW" />
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                  route.active ? 'bg-muted font-medium text-primary' : 'text-muted-foreground'
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
            <Link to="/login" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" onClick={() => logout()} />
              Sair
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
