import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/budget", label: "Budget" },
  { href: "/expenses", label: "Expenses & Savings" },
  { href: "/resources", label: "Financial Resources" },
  { href: "/connect", label: "Career Connect" },
  { href: "/news", label: "News" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <span className="h-3 w-3 rounded-sm bg-primary block" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">FinSight</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <AuthButtons />
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="container py-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="py-1 text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <ThemeToggle />
            </div>
            <AuthButtons compact />
          </div>
        </div>
      )}
    </header>
  );
}

function AuthButtons({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  
  if (user) {
    return (
      <div className={cn("flex items-center gap-2", compact && "flex-col items-stretch")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  return (
    <>
      <div className={cn("flex items-center gap-2", compact && "flex-col items-stretch")}>
        <Button variant="ghost" onClick={() => setLoginOpen(true)}>Log in</Button>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setLoginOpen(true)}
        >
          Sign up
        </Button>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
