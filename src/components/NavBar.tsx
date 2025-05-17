
import { Link } from "react-router-dom";
import { Volume2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavBarProps {
  currentPage: "analyzer" | "chat";
}

const NavBar = ({ currentPage }: NavBarProps) => {
  return (
    <nav className="w-full p-3 bg-white/70 backdrop-blur-sm fixed top-0 z-10 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-baby-purple" />
          <span className="font-medium hidden sm:inline">Baby Care Assistant</span>
        </Link>
        
        <div className="flex gap-2">
          <Button 
            variant={currentPage === "analyzer" ? "default" : "ghost"} 
            size="sm" 
            asChild
          >
            <Link to="/" className="gap-1">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Cry Analyzer</span>
            </Link>
          </Button>
          
          <Button 
            variant={currentPage === "chat" ? "default" : "ghost"} 
            size="sm" 
            asChild
          >
            <Link to="/chat" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Mommy Assistant</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
