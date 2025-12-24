import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, ChevronDown, Shield, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminAuthService } from "@/services/adminAuthService";
import { useToast } from "@/hooks/use-toast";

const semesters = [
  { id: 1, name: "1-1" },
  { id: 2, name: "1-2" },
  { id: 3, name: "2-1" },
  { id: 4, name: "2-2" },
  { id: 5, name: "3-1" },
  { id: 6, name: "3-2" },
  { id: 7, name: "4-1" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSemesters, setShowSemesters] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const isLoggedIn = adminAuthService.isLoggedIn();
  const [, setRefresh] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      setRefresh(prev => prev + 1);
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground leading-tight">VVIT</span>
              <span className="text-xs text-muted-foreground leading-tight">Materials Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                size="sm"
                className="font-medium"
              >
                Home
              </Button>
            </Link>
            
            {/* Materials Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowSemesters(true)}
              onMouseLeave={() => setShowSemesters(false)}
            >
              <Link to="/materials">
                <Button
                  variant={location.pathname.includes("/materials") || location.pathname.includes("/semester") ? "secondary" : "ghost"}
                  size="sm"
                  className="font-medium gap-1"
                >
                  Materials
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showSemesters && "rotate-180")} />
                </Button>
              </Link>
              
              {showSemesters && (
                <div className="absolute top-full left-0 pt-2 animate-fade-in">
                  <div className="bg-card rounded-xl shadow-elevated border border-border p-2 min-w-[180px]">
                    {semesters.map((sem) => (
                      <Link key={sem.id} to={`/semester/${sem.id}`}>
                        <Button
                          variant={location.pathname === `/semester/${sem.id}` ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start font-medium"
                        >
                          {sem.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="ghost" size="sm" className="gap-1">
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Button>
              </Link>
            )}
            <Link to="/materials">
              <Button variant="accent" size="sm">
                Browse Materials
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                Home
              </Button>
            </Link>
            <Link to="/materials" onClick={() => setIsOpen(false)}>
              <Button
                variant={isActive("/materials") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                All Materials
              </Button>
            </Link>
            <div className="pl-4 space-y-1">
              {semesters.map((sem) => (
                <Link key={sem.id} to={`/semester/${sem.id}`} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={location.pathname === `/semester/${sem.id}` ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    {sem.name}
                  </Button>
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Buttons */}
            <div className="pt-2 border-t border-border space-y-2">
              {isLoggedIn ? (
                <>
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LogIn className="w-4 h-4" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
