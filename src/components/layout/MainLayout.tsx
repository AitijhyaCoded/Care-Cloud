
import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  hideNavigation?: boolean;
}

export function MainLayout({ 
  children, 
  pageTitle, 
  hideNavigation = false 
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20">
      {pageTitle && (
        <header className="py-6 px-6 md:px-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-care-text">{pageTitle}</h1>
        </header>
      )}
      
      <main className="px-4 md:px-8 mx-auto animate-fade-in md:max-w-3xl lg:max-w-4xl">
        {children}
      </main>
      
      {!hideNavigation && currentUser && <Navigation />}
    </div>
  );
}
