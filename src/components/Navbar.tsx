
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, BookOpenText, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center p-4 border-t border-border bg-background/80 backdrop-blur-lg shadow-lg md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="flex items-center justify-between w-full max-w-screen-lg">
        <div className="hidden md:block">
          <Link to="/" className="text-xl font-bold tracking-tight">
            TradeScribe
          </Link>
        </div>
        
        <div className="flex items-center justify-center space-x-2 w-full md:justify-end md:space-x-6">
          <NavLink 
            to="/" 
            isActive={isActive('/')} 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Dashboard" 
          />
          
          <NavLink 
            to="/trades" 
            isActive={isActive('/trades')} 
            icon={<BookOpenText className="h-5 w-5" />} 
            label="Journal" 
          />
          
          <NavLink 
            to="/add-trade" 
            isActive={isActive('/add-trade')} 
            icon={<PlusCircle className="h-5 w-5" />} 
            label="Add Trade" 
          />
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavLink = ({ to, isActive, icon, label }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col md:flex-row items-center justify-center p-2 rounded-md transition-all duration-300",
        "hover:bg-accent",
        "md:px-4 md:py-2 md:space-x-2",
        isActive ? "text-primary font-medium" : "text-muted-foreground"
      )}
    >
      <span className="relative">
        {icon}
        {isActive && (
          <motion.span 
            layoutId="navbar-indicator"
            className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full" 
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </span>
      <span className="text-xs md:text-sm">{label}</span>
    </Link>
  );
};

export default Navbar;
