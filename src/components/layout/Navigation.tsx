
import { Home, Calendar, Mic, HeartPulse, Music, Bot, UserRound, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function Navigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Tracker", path: "/tracker" },
    { icon: Mic, label: "Journal", path: "/journal" },
    { icon: HeartPulse, label: "Calm", path: "/calm" },
    { icon: Music, label: "Entertain", path: "/entertain" },
    { icon: Bot, label: "AI Companion", path: "/ai-companion" },
  ];
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <nav className={`${isMobile ? 'fixed bottom-0 left-0 right-0' : 'sticky top-0 left-0 right-0'} bg-white border-t md:border-b border-gray-100 shadow-lg py-2 px-4 z-50`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center py-1 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-care-dark bg-care-lightest"
                  : "text-care-text hover:text-care-dark hover:bg-care-lightest/50"
              }`}
            >
              <item.icon size={20} className={isMobile ? '' : 'mr-2'} />
              <span className={`${isMobile ? 'text-xs mt-1' : 'text-sm'}`}>{item.label}</span>
            </Link>
          );
        })}
        
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
                  <AvatarFallback className="text-xs">
                    {currentUser.displayName ? getInitials(currentUser.displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{currentUser.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserRound className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
